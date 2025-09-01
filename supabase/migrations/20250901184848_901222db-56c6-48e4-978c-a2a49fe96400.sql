-- Enable RLS on chat tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_status ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in" ON conversations
FOR SELECT USING (
  id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update conversations they created or participate in" ON conversations
FOR UPDATE USING (
  created_by = auth.uid() OR 
  id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

-- Conversation participants policies
CREATE POLICY "Users can view participants in their conversations" ON conversation_participants
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can add participants to conversations they created" ON conversation_participants
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE created_by = auth.uid()
  ) OR user_id = auth.uid()
);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to conversations they participate in" ON messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT conversation_id FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (sender_id = auth.uid());

-- Message status policies
CREATE POLICY "Users can view message status for their conversations" ON message_status
FOR SELECT USING (
  message_id IN (
    SELECT id FROM messages 
    WHERE conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update message status" ON message_status
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their message status" ON message_status
FOR UPDATE USING (user_id = auth.uid());

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_status;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Set replica identity for realtime updates
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER TABLE conversation_participants REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE message_status REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;

-- Create function to update conversation timestamp on new message
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating conversation timestamp
CREATE TRIGGER update_conversation_timestamp_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();