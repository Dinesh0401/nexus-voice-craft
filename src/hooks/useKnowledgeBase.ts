import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'alumni_profile' | 'document' | 'conversation' | 'event' | 'opportunity';

export interface IndexContentParams {
  content: string;
  contentType: ContentType;
  metadata?: Record<string, any>;
  sourceId?: string;
}

export const useKnowledgeBase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const indexContent = async (params: IndexContentParams) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('generate-embeddings', {
        body: params,
      });

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to index content';
      setError(errorMessage);
      console.error('Indexing error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const indexAllProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('index-profiles');

      if (functionError) {
        throw functionError;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to index profiles';
      setError(errorMessage);
      console.error('Profile indexing error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchKnowledge = async (query: string, contentType?: ContentType) => {
    try {
      setLoading(true);
      setError(null);

      // This will use the RAG query function for searching
      const { data, error: functionError } = await supabase.functions.invoke('rag-query', {
        body: {
          query,
          agentType: 'career_strategist',
        },
      });

      if (functionError) {
        throw functionError;
      }

      return data.sources;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search knowledge base';
      setError(errorMessage);
      console.error('Search error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    indexContent,
    indexAllProfiles,
    searchKnowledge,
    loading,
    error,
  };
};
