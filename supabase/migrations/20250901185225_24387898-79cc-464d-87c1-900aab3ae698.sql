-- Add foreign key relationship between conversation_participants and profiles
ALTER TABLE conversation_participants 
ADD CONSTRAINT conversation_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id 
ON conversation_participants(user_id);