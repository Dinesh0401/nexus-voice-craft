import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, agentType, userId, conversationHistory } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Generate query embedding
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 2: Retrieve relevant context using hybrid search
    const { data: semanticResults, error: semanticError } = await supabase.rpc(
      'match_knowledge_base',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 10,
      }
    );

    if (semanticError) {
      console.error('Semantic search error:', semanticError);
    }

    // Step 3: Get user context if userId provided
    let userContext = null;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: insights } = await supabase
        .from('career_insights')
        .select('*')
        .eq('user_id', userId)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: connections } = await supabase
        .from('user_knowledge_graph')
        .select('*')
        .eq('user_id', userId)
        .order('compatibility_score', { ascending: false })
        .limit(5);

      userContext = {
        profile,
        recentInsights: insights || [],
        topConnections: connections || [],
      };
    }

    // Step 4: Build agent-specific system prompt
    const agentPrompts = {
      career_strategist: `You are an expert career strategist AI. Analyze career paths, suggest transitions, and predict success probabilities based on data. Use chain-of-thought reasoning to break down complex career decisions.`,
      mentor_matcher: `You are a mentor matching specialist AI. Analyze compatibility between mentors and mentees based on skills, interests, personality, and goals. Provide detailed reasoning for matches.`,
      interview_coach: `You are an interview coaching AI. Provide personalized feedback on interview performance, suggest improvements, and generate role-specific practice questions.`,
      network_analyzer: `You are a networking intelligence AI. Identify influential connections, analyze network strength, and suggest optimal networking strategies.`,
      event_curator: `You are an event recommendation AI. Suggest personalized events based on career goals, interests, and optimal timing for maximum impact.`,
    };

    const systemPrompt = agentPrompts[agentType] || agentPrompts.career_strategist;

    // Step 5: Construct context for LLM
    const contextParts = [];
    
    if (semanticResults && semanticResults.length > 0) {
      contextParts.push('Relevant knowledge from database:');
      semanticResults.forEach((result, idx) => {
        contextParts.push(`${idx + 1}. ${result.content} (similarity: ${result.similarity?.toFixed(2)})`);
      });
    }

    if (userContext) {
      contextParts.push('\nUser Profile:');
      contextParts.push(`Name: ${userContext.profile?.full_name || 'Unknown'}`);
      contextParts.push(`Bio: ${userContext.profile?.bio || 'No bio'}`);
      
      if (userContext.recentInsights.length > 0) {
        contextParts.push('\nRecent Career Insights:');
        userContext.recentInsights.forEach((insight, idx) => {
          contextParts.push(`${idx + 1}. ${insight.insight_type}: ${JSON.stringify(insight.prediction)}`);
        });
      }

      if (userContext.topConnections.length > 0) {
        contextParts.push('\nTop Connections:');
        userContext.topConnections.forEach((conn, idx) => {
          contextParts.push(`${idx + 1}. Score: ${conn.compatibility_score}, Interests: ${conn.shared_interests?.join(', ')}`);
        });
      }
    }

    const context = contextParts.join('\n');

    // Step 6: Generate response using LLM
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Context:\n${context}` },
      ...(conversationHistory || []),
      { role: 'user', content: query },
    ];

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const completionData = await completionResponse.json();
    const response = completionData.choices[0].message.content;

    // Step 7: Save conversation if userId provided
    if (userId) {
      const conversationMessages = [
        ...(conversationHistory || []),
        { role: 'user', content: query },
        { role: 'assistant', content: response },
      ];

      await supabase
        .from('agent_conversations')
        .upsert({
          user_id: userId,
          agent_type: agentType,
          messages: conversationMessages,
          context_summary: query.substring(0, 200),
          updated_at: new Date().toISOString(),
        });
    }

    return new Response(
      JSON.stringify({
        response,
        sources: semanticResults?.slice(0, 3) || [],
        agentType,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
