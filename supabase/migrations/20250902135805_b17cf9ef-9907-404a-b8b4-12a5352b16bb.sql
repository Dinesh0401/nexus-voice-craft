-- Create connections table for user relationships
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent duplicate connections
  UNIQUE(requester_id, recipient_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for connections
CREATE POLICY "Users can view connections they are part of"
ON public.connections FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connection requests"
ON public.connections FOR INSERT
WITH CHECK (auth.uid() = requester_id AND requester_id != recipient_id);

CREATE POLICY "Users can update connection status for requests to them"
ON public.connections FOR UPDATE
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

-- Create indexes for better performance
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_recipient ON connections(recipient_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Update profiles RLS to allow users to search for other users
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

-- Function to get user connections
CREATE OR REPLACE FUNCTION get_user_connections(user_uuid UUID)
RETURNS TABLE (
  connection_id UUID,
  connected_user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  is_online BOOLEAN,
  status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as connection_id,
    p.id as connected_user_id,
    p.full_name,
    p.avatar_url,
    p.is_online,
    c.status
  FROM connections c
  JOIN profiles p ON (
    CASE 
      WHEN c.requester_id = user_uuid THEN p.id = c.recipient_id
      ELSE p.id = c.requester_id
    END
  )
  WHERE (c.requester_id = user_uuid OR c.recipient_id = user_uuid)
    AND c.status = 'accepted';
END;
$$;