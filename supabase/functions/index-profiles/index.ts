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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      throw error;
    }

    console.log(`Indexing ${profiles.length} profiles...`);

    let indexed = 0;
    let failed = 0;

    for (const profile of profiles) {
      try {
        // Create rich profile content for embedding
        const profileContent = `
          Name: ${profile.full_name || 'Unknown'}
          Username: ${profile.username || 'Unknown'}
          Bio: ${profile.bio || 'No bio provided'}
          Status: ${profile.status || 'No status'}
          Online: ${profile.is_online ? 'Yes' : 'No'}
        `.trim();

        // Generate embedding
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: profileContent,
          }),
        });

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Store in knowledge base
        await supabase
          .from('knowledge_base')
          .upsert({
            content: profileContent,
            content_type: 'alumni_profile',
            embedding,
            metadata: {
              profile_id: profile.id,
              username: profile.username,
              is_online: profile.is_online,
            },
            source_id: profile.id,
          }, {
            onConflict: 'source_id,content_type'
          });

        indexed++;
        console.log(`Indexed profile: ${profile.username || profile.id}`);
      } catch (error) {
        console.error(`Failed to index profile ${profile.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        indexed,
        failed,
        total: profiles.length,
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
