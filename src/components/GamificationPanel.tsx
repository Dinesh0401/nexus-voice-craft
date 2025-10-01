import { motion } from 'framer-motion';
import { useGamification } from '@/hooks/useGamification';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const GamificationPanel = () => {
  const { stats, achievements, loading, getNextLevelProgress } = useGamification();

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  const progress = getNextLevelProgress();
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {stats.level}</h3>
            <p className="text-sm text-muted-foreground">{stats.totalPoints} Total Points</p>
          </div>
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Connections</span>
          </div>
          <p className="text-2xl font-bold">{stats.connectionsCount}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Mentorships</span>
          </div>
          <p className="text-2xl font-bold">{stats.mentorshipSessions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Events</span>
          </div>
          <p className="text-2xl font-bold">{stats.eventsAttended}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Posts</span>
          </div>
          <p className="text-2xl font-bold">{stats.postsCreated}</p>
        </motion.div>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Achievements ({unlockedAchievements.length}/{achievements.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/50 border-muted opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <Badge variant={achievement.unlocked ? 'default' : 'secondary'} className="text-xs">
                    {achievement.points} pts
                  </Badge>
                </div>
              </div>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
