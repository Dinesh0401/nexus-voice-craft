import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client to get user context
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let userProfile = null;
    if (userId) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, bio, expertise_areas, graduation_year, current_role, current_company')
        .eq('id', userId)
        .single();
      userProfile = data;
    }

    // Build context-aware system prompt
    const systemPrompt = `You are River, an intelligent AI assistant for the Knowledge Institute of Technology Alumni Network (alumNexus). You help students and alumni with:

CORE FUNCTIONS:
- Alumni networking and mentorship connections
- Career guidance and industry insights  
- Event recommendations and scheduling
- Mock interview practice and feedback
- Academic program information
- Professional development advice

USER CONTEXT: ${userProfile ? `
- Name: ${userProfile.full_name}
- Current Role: ${userProfile.current_role || 'Not specified'}
- Company: ${userProfile.current_company || 'Not specified'}
- Graduation Year: ${userProfile.graduation_year || 'Current student'}
- Expertise: ${userProfile.expertise_areas?.join(', ') || 'Not specified'}
` : 'Anonymous user'}

PERSONALITY:
- Friendly, professional, and encouraging
- Use the user's name when available
- Provide actionable, specific advice
- Ask clarifying questions to better help
- Suggest relevant alumni connections when appropriate

CAPABILITIES:
- Search and recommend alumni mentors
- Provide career transition guidance
- Suggest networking opportunities
- Help with interview preparation
- Share industry insights and trends
- Recommend relevant events and workshops

Always be helpful, concise, and focused on connecting people and advancing careers. If asked about technical platform issues, direct users to contact support.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...context,
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the conversation for analytics
    console.log(`AI Chat - User: ${userId || 'Anonymous'}, Message: ${message}, Response: ${aiResponse}`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "I'm sorry, I'm having trouble right now. Please try again in a moment, or contact our support team for assistance."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});