import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AgentType = 'career_strategist' | 'mentor_matcher' | 'interview_coach' | 'network_analyzer' | 'event_curator';

export interface RAGMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface RAGResponse {
  response: string;
  sources: Array<{
    id: string;
    content: string;
    content_type: string;
    similarity: number;
  }>;
  agentType: AgentType;
  timestamp: string;
}

export const useRAGAgent = (agentType: AgentType = 'career_strategist') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<RAGMessage[]>([]);

  const query = async (userMessage: string): Promise<RAGResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error: functionError } = await supabase.functions.invoke('rag-query', {
        body: {
          query: userMessage,
          agentType,
          userId: user?.id,
          conversationHistory,
        },
      });

      if (functionError) {
        throw functionError;
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response },
      ]);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to query RAG agent';
      setError(errorMessage);
      console.error('RAG query error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
  };

  const loadConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agent_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_type', agentType)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return;

      // Type cast messages safely
      const messages = (data.messages || []) as unknown as RAGMessage[];
      setConversationHistory(messages);
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  return {
    query,
    loading,
    error,
    conversationHistory,
    clearHistory,
    loadConversation,
  };
};
