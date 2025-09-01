-- Create sample users and profiles
INSERT INTO auth.users (id, email, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'john.smith@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'emily.johnson@example.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, full_name, avatar_url, is_online, status) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', '👨‍💼', true, 'Available for mentoring'),
('550e8400-e29b-41d4-a716-446655440002', 'Emily Johnson', '👩‍🎓', false, 'Alumni from Class of 2020')
ON CONFLICT (id) DO NOTHING;

-- Create sample conversation
INSERT INTO conversations (id, name, is_group, created_by) VALUES 
('c1234567-8901-2345-6789-abcdefghijkl', null, false, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Add participants to conversation
INSERT INTO conversation_participants (conversation_id, user_id) VALUES 
('c1234567-8901-2345-6789-abcdefghijkl', '550e8400-e29b-41d4-a716-446655440001'),
('c1234567-8901-2345-6789-abcdefghijkl', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

-- Add sample messages
INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES 
('c1234567-8901-2345-6789-abcdefghijkl', '550e8400-e29b-41d4-a716-446655440001', 'Hi there! How can I help you with your career questions?', 'text'),
('c1234567-8901-2345-6789-abcdefghijkl', '550e8400-e29b-41d4-a716-446655440002', 'I''m looking for advice on transitioning to a new industry. Do you have any resources?', 'text'),
('c1234567-8901-2345-6789-abcdefghijkl', '550e8400-e29b-41d4-a716-446655440001', 'Absolutely! I''d be happy to share some resources. Let''s schedule a call to discuss your specific situation in more detail.', 'text');