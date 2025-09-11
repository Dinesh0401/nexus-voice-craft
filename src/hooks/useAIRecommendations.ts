import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRecommendation {
  id: string;
  type: 'mentor' | 'event' | 'connection' | 'opportunity';
  title: string;
  description: string;
  relevanceScore: number;
  data: Record<string, any>;
  createdAt: Date;
}

export const useAIRecommendations = (userId?: string) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    generateRecommendations();
  }, [userId]);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user profile for context
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        setRecommendations([]);
        return;
      }

      // Generate different types of recommendations
      const mentorRecs = await generateMentorRecommendations(profile);
      const eventRecs = await generateEventRecommendations(profile);
      const connectionRecs = await generateConnectionRecommendations(profile);

      // Combine and sort by relevance score
      const allRecommendations = [...mentorRecs, ...eventRecs, ...connectionRecs]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10); // Limit to top 10

      setRecommendations(allRecommendations);

    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateMentorRecommendations = async (profile: Record<string, any>): Promise<AIRecommendation[]> => {
    const { data: alumni } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', profile.id)
      .limit(5);

    if (!alumni) return [];

    return alumni.map((alumnus, index): AIRecommendation => ({
      id: `mentor-${alumnus.id}`,
      type: 'mentor',
      title: `Connect with ${alumnus.full_name}`,
      description: `${alumnus.bio || 'Alumni member'} - Great potential mentor for your career journey`,
      relevanceScore: 0.9 - (index * 0.1),
      data: alumnus,
      createdAt: new Date()
    }));
  };

  const generateEventRecommendations = async (profile: Record<string, any>): Promise<AIRecommendation[]> => {
    // Mock event recommendations - in real app, would query events table
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Tech Career Fair 2024',
        description: 'Network with top tech companies',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
      },
      {
        id: 'event-2', 
        title: 'AI in Business Workshop',
        description: 'Learn about AI applications in your industry',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // In 2 weeks
      }
    ];

    return mockEvents.map((event, index): AIRecommendation => ({
      id: `event-${event.id}`,
      type: 'event',
      title: event.title,
      description: event.description,
      relevanceScore: 0.8 - (index * 0.1),
      data: event,
      createdAt: new Date()
    }));
  };

  const generateConnectionRecommendations = async (profile: Record<string, any>): Promise<AIRecommendation[]> => {
    const { data: potentialConnections } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', profile.id)
      .limit(3);

    if (!potentialConnections) return [];

    return potentialConnections.map((connection, index): AIRecommendation => ({
      id: `connection-${connection.id}`,
      type: 'connection',
      title: `You should meet ${connection.full_name}`,
      description: `${connection.bio || 'Fellow alumni'} - Similar interests and background`,
      relevanceScore: 0.7 - (index * 0.1),
      data: connection,
      createdAt: new Date()
    }));
  };

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    dismissRecommendation
  };
};