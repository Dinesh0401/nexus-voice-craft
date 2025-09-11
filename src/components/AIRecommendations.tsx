import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Users, Calendar, TrendingUp, X, RefreshCw } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AIRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { recommendations, loading, refreshRecommendations, dismissRecommendation } = useAIRecommendations(user?.id);
  const { toast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'mentor':
        return <Users className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'connection':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mentor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'event':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'connection':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleConnect = (recommendation: any) => {
    toast({
      title: "Connection Request Sent!",
      description: `Your request to connect with ${recommendation.data.full_name || recommendation.title} has been sent.`,
    });
    dismissRecommendation(recommendation.id);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card className="w-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="w-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Recommendations</span>
            </div>
            <Button variant="ghost" size="sm" onClick={refreshRecommendations}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recommendations available right now. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span>AI Recommendations</span>
            <Badge variant="secondary" className="text-xs">
              Personalized for you
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshRecommendations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {recommendations.slice(0, 5).map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex items-start space-x-3 flex-1">
                  {rec.type === 'mentor' || rec.type === 'connection' ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={rec.data.avatar_url} />
                      <AvatarFallback>
                        {rec.data.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getIcon(rec.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {rec.title}
                      </h4>
                      <Badge className={`${getTypeColor(rec.type)} text-xs px-2 py-0.5`}>
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full mr-0.5 ${
                                i < Math.floor(rec.relevanceScore * 5)
                                  ? 'bg-primary'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(rec.relevanceScore * 100)}% match
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConnect(rec)}
                          className="h-7 px-3 text-xs"
                        >
                          Connect
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissRecommendation(rec.id)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recommendations.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View all {recommendations.length} recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;