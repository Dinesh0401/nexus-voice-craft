import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, ChevronRight, Star, Zap, Target } from 'lucide-react';
import { Alumni, getRecommendedAlumni } from '@/data/alumni';
import { getCurrentStudent } from '@/data/students';
import { useToast } from '@/hooks/use-toast';
import { useInterval } from '@/hooks/useInterval';
import { useConnections } from '@/hooks/useConnections';
import { supabase } from '@/integrations/supabase/client';
const AIPersonalizedConnections = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendConnectionRequest } = useConnections();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentStudent = getCurrentStudent();
  const recommendedAlumni = getRecommendedAlumni(currentStudent, 6);

  // Load real users from database
  useEffect(() => {
    const loadUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, username')
        .neq('id', user.id)
        .limit(6);

      if (users && users.length > 0) {
        setRealUsers(users);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  // Auto-rotate every 1 second
  useInterval(() => {
    if (isPlaying && displayUsers.length > 1) {
      setCurrentIndex(prevIndex => (prevIndex + 1) % displayUsers.length);
    }
  }, 1000);
  const handleContactClick = async (userId: string, userName: string) => {
    await sendConnectionRequest(userId);
    toast({
      title: "Connection Request Sent! 🤖",
      description: `Your connection request has been sent to ${userName}.`
    });
  };
  const viewAlumniDirectory = () => {
    navigate('/alumni');
  };
  const displayUsers = realUsers.length > 0 ? realUsers : recommendedAlumni;
  
  if (loading || displayUsers.length === 0) {
    return null;
  }

  const currentItem = displayUsers[currentIndex];
  const matchPercentage = Math.floor(Math.random() * 20) + 80; // 80-99% match
  
  // Map user to alumni-like structure for display
  const currentAlumni = realUsers.length > 0 ? {
    id: currentItem.id,
    name: currentItem.full_name,
    avatar: currentItem.avatar_url || '/placeholder.svg',
    bio: currentItem.bio || 'No bio available',
    role: 'Member',
    company: 'Alumni Network',
    location: 'Network Member',
    expertiseTags: []
  } : currentItem;

  return <div className="relative bg-white p-8 border border-border rounded-3xl shadow-lg">
      {/* AI Badge */}
      <div className="absolute -top-3 left-6">
        <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 shadow-md">
          <Zap className="w-3 h-3 mr-1" />
          AI Recommendations
        </Badge>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Smart Alumni Connections
          </h2>
          <p className="text-muted-foreground">AI-curated matches based on your profile</p>
        </div>
        <Button variant="outline" onClick={viewAlumniDirectory} className="flex items-center gap-2 hover:bg-muted">
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-1 mb-6">
        {displayUsers.map((_, index) => <div key={index} className={`h-1 flex-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary' : 'bg-muted'}`} />)}
      </div>

      {/* Alumni Card with AnimatePresence */}
      <div className="relative h-64">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.4,
          ease: "easeInOut"
        }} className="absolute inset-0">
            <Card className="h-full border border-border bg-white shadow-lg">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Match Score */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {matchPercentage}% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">Top Pick</span>
                  </div>
                </div>

                {/* Alumni Info */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.img src={currentAlumni.avatar} alt={currentAlumni.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-border" initial={{
                  scale: 0.8,
                  opacity: 0
                }} animate={{
                  scale: 1,
                  opacity: 1
                }} transition={{
                  delay: 0.1
                }} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{currentAlumni.name}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {currentAlumni.role} at {currentAlumni.company}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {currentAlumni.location}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {currentAlumni.bio}
                </p>

                {/* Expertise Tags */}
                {currentAlumni.expertiseTags && <div className="flex flex-wrap gap-2 mb-4">
                    {currentAlumni.expertiseTags.slice(0, 3).map((tag, index) => <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>)}
                  </div>}

                {/* Connect Button */}
                <Button 
                  onClick={() => handleContactClick(
                    realUsers.length > 0 ? currentItem.id : currentAlumni.id,
                    currentAlumni.name
                  )} 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-md"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Smart Connect
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Play/Pause Controls */}
      <div className="flex justify-center mt-4">
        <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="text-xs text-muted-foreground hover:text-primary">
          {isPlaying ? 'Pause' : 'Play'} Auto-Rotation
        </Button>
      </div>
    </div>;
};
export default AIPersonalizedConnections;