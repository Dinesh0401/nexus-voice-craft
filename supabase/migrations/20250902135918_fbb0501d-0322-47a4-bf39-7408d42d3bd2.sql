-- Fix function security by setting search_path
DROP FUNCTION IF EXISTS get_user_connections(UUID);

CREATE OR REPLACE FUNCTION public.get_user_connections(user_uuid UUID)
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
SET search_path = public
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