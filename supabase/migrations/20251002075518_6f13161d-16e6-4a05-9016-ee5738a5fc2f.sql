-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table for storing vectorized content
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'alumni_profile', 'document', 'conversation', 'event', 'opportunity'
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  metadata JSONB DEFAULT '{}',
  source_id UUID, -- Reference to original content (profile_id, message_id, etc.)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create HNSW index for fast vector similarity search
CREATE INDEX knowledge_base_embedding_idx ON knowledge_base 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Full-text search index for hybrid search
CREATE INDEX knowledge_base_content_idx ON knowledge_base 
USING gin(to_tsvector('english', content));

-- Metadata index for filtering
CREATE INDEX knowledge_base_metadata_idx ON knowledge_base USING gin(metadata);

-- Agent conversations table for episodic memory
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  agent_type TEXT NOT NULL, -- 'career_strategist', 'mentor_matcher', 'interview_coach', etc.
  messages JSONB[] DEFAULT ARRAY[]::JSONB[],
  context_summary TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user conversations
CREATE INDEX agent_conversations_user_idx ON agent_conversations(user_id);
CREATE INDEX agent_conversations_agent_idx ON agent_conversations(agent_type);
CREATE INDEX agent_conversations_embedding_idx ON agent_conversations 
USING hnsw (embedding vector_cosine_ops);

-- User knowledge graph for relationship tracking
CREATE TABLE IF NOT EXISTS user_knowledge_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  connected_user_id UUID NOT NULL,
  relationship_type TEXT NOT NULL, -- 'mentor', 'mentee', 'colleague', 'connection'
  interaction_count INTEGER DEFAULT 0,
  compatibility_score DECIMAL(3,2) DEFAULT 0.0,
  last_interaction TIMESTAMPTZ,
  shared_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX user_knowledge_graph_user_idx ON user_knowledge_graph(user_id);
CREATE INDEX user_knowledge_graph_connected_idx ON user_knowledge_graph(connected_user_id);
CREATE INDEX user_knowledge_graph_type_idx ON user_knowledge_graph(relationship_type);

-- Career insights table for ML predictions
CREATE TABLE IF NOT EXISTS career_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'career_path', 'skill_gap', 'opportunity', 'risk'
  prediction JSONB NOT NULL,
  confidence_score DECIMAL(3,2),
  data_sources TEXT[] DEFAULT ARRAY[]::TEXT[],
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX career_insights_user_idx ON career_insights(user_id);
CREATE INDEX career_insights_type_idx ON career_insights(insight_type);
CREATE INDEX career_insights_valid_idx ON career_insights(valid_until);

-- RLS Policies
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_knowledge_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;

-- Knowledge base is readable by authenticated users
CREATE POLICY "knowledge_base_select_authenticated" ON knowledge_base
  FOR SELECT TO authenticated USING (true);

-- Agent conversations policies
CREATE POLICY "agent_conversations_select_own" ON agent_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "agent_conversations_insert_own" ON agent_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agent_conversations_update_own" ON agent_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- User knowledge graph policies
CREATE POLICY "user_knowledge_graph_select_own" ON user_knowledge_graph
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "user_knowledge_graph_insert_own" ON user_knowledge_graph
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_knowledge_graph_update_own" ON user_knowledge_graph
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Career insights policies
CREATE POLICY "career_insights_select_own" ON career_insights
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "career_insights_insert_own" ON career_insights
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_conversations_updated_at BEFORE UPDATE ON agent_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_knowledge_graph_updated_at BEFORE UPDATE ON user_knowledge_graph
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();