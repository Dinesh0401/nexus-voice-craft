import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const testUsers = [
      {
        email: 'sarah.alumni@test.com',
        password: 'Test123!',
        full_name: 'Sarah Johnson',
        username: 'sarah_j',
        bio: 'Software Engineer at Google | Passionate about mentoring students in tech careers',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        email: 'michael.alumni@test.com',
        password: 'Test123!',
        full_name: 'Michael Chen',
        username: 'mike_chen',
        bio: 'Product Manager at Amazon | Love helping students break into product management',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
      },
      {
        email: 'priya.student@test.com',
        password: 'Test123!',
        full_name: 'Priya Sharma',
        username: 'priya_s',
        bio: 'Computer Science student | Interested in AI/ML and looking for mentorship',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
      },
      {
        email: 'james.alumni@test.com',
        password: 'Test123!',
        full_name: 'James Wilson',
        username: 'james_w',
        bio: 'Data Scientist at Meta | Happy to share career insights and technical guidance',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
      }
    ]

    const createdUsers = []

    for (const user of testUsers) {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          username: user.username
        }
      })

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError)
        continue
      }

      // Update profile with bio and avatar
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          bio: user.bio,
          avatar_url: user.avatar_url,
          username: user.username,
          full_name: user.full_name
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError)
      }

      createdUsers.push({
        email: user.email,
        id: authData.user.id
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${createdUsers.length} test users`,
        users: createdUsers
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
