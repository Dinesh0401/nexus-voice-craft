import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'networking' | 'mentorship' | 'learning' | 'contribution';
}

export interface UserStats {
  totalPoints: number;
  level: number;
  rank: number;
  connectionsCount: number;
  mentorshipSessions: number;
  eventsAttended: number;
  postsCreated: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    rank: 0,
    connectionsCount: 0,
    mentorshipSessions: 0,
    eventsAttended: 0,
    postsCreated: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const allAchievements: Achievement[] = [
    {
      id: 'first-connection',
      title: 'First Connection',
      description: 'Made your first connection',
      icon: '🤝',
      points: 10,
      unlocked: false,
      category: 'networking'
    },
    {
      id: 'networker',
      title: 'Social Butterfly',
      description: 'Connected with 10 alumni',
      icon: '🦋',
      points: 50,
      unlocked: false,
      category: 'networking'
    },
    {
      id: 'super-networker',
      title: 'Super Connector',
      description: 'Connected with 50 alumni',
      icon: '🌟',
      points: 200,
      unlocked: false,
      category: 'networking'
    },
    {
      id: 'first-mentor',
      title: 'Mentorship Seeker',
      description: 'Completed first mentorship session',
      icon: '🎓',
      points: 25,
      unlocked: false,
      category: 'mentorship'
    },
    {
      id: 'mentor-champion',
      title: 'Mentorship Champion',
      description: 'Completed 10 mentorship sessions',
      icon: '🏆',
      points: 100,
      unlocked: false,
      category: 'mentorship'
    },
    {
      id: 'event-attendee',
      title: 'Event Explorer',
      description: 'Attended your first event',
      icon: '🎪',
      points: 15,
      unlocked: false,
      category: 'learning'
    },
    {
      id: 'event-regular',
      title: 'Event Regular',
      description: 'Attended 5 events',
      icon: '🎯',
      points: 75,
      unlocked: false,
      category: 'learning'
    },
    {
      id: 'content-creator',
      title: 'Content Creator',
      description: 'Created 5 forum posts',
      icon: '✍️',
      points: 50,
      unlocked: false,
      category: 'contribution'
    },
    {
      id: 'thought-leader',
      title: 'Thought Leader',
      description: 'Created 20 forum posts',
      icon: '💡',
      points: 150,
      unlocked: false,
      category: 'contribution'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Load from local storage or initialize with demo data
      const storageKey = `gamification_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      
      let connectionsCount = 0;
      let mentorshipSessions = 0;
      let eventsAttended = 0;
      let postsCreated = 0;

      if (stored) {
        const data = JSON.parse(stored);
        connectionsCount = data.connectionsCount || 0;
        mentorshipSessions = data.mentorshipSessions || 0;
        eventsAttended = data.eventsAttended || 0;
        postsCreated = data.postsCreated || 0;
      } else {
        // Demo data for new users
        connectionsCount = 3;
        mentorshipSessions = 1;
        eventsAttended = 2;
        postsCreated = 1;
        
        localStorage.setItem(storageKey, JSON.stringify({
          connectionsCount,
          mentorshipSessions,
          eventsAttended,
          postsCreated
        }));
      }

      // Calculate points
      const totalPoints = 
        (connectionsCount * 10) +
        (mentorshipSessions * 25) +
        (eventsAttended * 15) +
        (postsCreated * 10);

      const level = Math.floor(totalPoints / 100) + 1;

      setStats({
        totalPoints,
        level,
        rank: 0,
        connectionsCount,
        mentorshipSessions,
        eventsAttended,
        postsCreated
      });

      checkAchievements(connectionsCount, mentorshipSessions, eventsAttended, postsCreated);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = (connections: number, mentorships: number, events: number, posts: number) => {
    const unlockedAchievements = allAchievements.map(achievement => {
      let unlocked = false;

      switch (achievement.id) {
        case 'first-connection':
          unlocked = connections >= 1;
          break;
        case 'networker':
          unlocked = connections >= 10;
          break;
        case 'super-networker':
          unlocked = connections >= 50;
          break;
        case 'first-mentor':
          unlocked = mentorships >= 1;
          break;
        case 'mentor-champion':
          unlocked = mentorships >= 10;
          break;
        case 'event-attendee':
          unlocked = events >= 1;
          break;
        case 'event-regular':
          unlocked = events >= 5;
          break;
        case 'content-creator':
          unlocked = posts >= 5;
          break;
        case 'thought-leader':
          unlocked = posts >= 20;
          break;
      }

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined
      };
    });

    setAchievements(unlockedAchievements);
  };

  const getNextLevelProgress = () => {
    const pointsInCurrentLevel = stats.totalPoints % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  return {
    stats,
    achievements,
    loading,
    getNextLevelProgress,
    refreshStats: loadUserStats
  };
};
