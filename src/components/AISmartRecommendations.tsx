import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aiAPI, alumniAPI, eventAPI, mentorshipAPI } from '@/services/api';
import { Sparkles, Users, Calendar, GraduationCap, Loader as Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const AISmartRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({
    alumni: '',
    mentors: '',
    events: '',
  });
  const { toast } = useToast();

  const userProfile = {
    interests: ['Software Engineering', 'Artificial Intelligence', 'Entrepreneurship'],
    skills: ['React', 'Python', 'Machine Learning'],
    careerGoals: 'Transition into AI/ML engineering role',
    experience: 'Entry Level',
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const [alumniRec, mentorRec, eventRec] = await Promise.all([
        aiAPI
          .getAlumniRecommendations(userProfile, [
            {
              name: 'Sarah Johnson',
              role: 'Senior ML Engineer',
              company: 'Google',
              expertise: ['AI', 'Python', 'TensorFlow'],
            },
            {
              name: 'Michael Chen',
              role: 'Tech Lead',
              company: 'Microsoft',
              expertise: ['Cloud', 'React', 'Node.js'],
            },
            {
              name: 'Emily Rodriguez',
              role: 'Data Scientist',
              company: 'Meta',
              expertise: ['ML', 'Statistics', 'Python'],
            },
          ])
          .catch(() => ({ recommendations: 'Connect with alumni in AI and software engineering fields.' })),
        aiAPI
          .getMentorSuggestions(userProfile, [
            {
              name: 'Dr. James Wilson',
              expertise: 'AI Research & Development',
              experience: '15 years',
            },
            { name: 'Lisa Park', expertise: 'Software Engineering', experience: '10 years' },
          ])
          .catch(() => ({ suggestions: 'Find mentors with AI and engineering expertise.' })),
        aiAPI
          .getEventRecommendations(userProfile, [
            { name: 'AI Summit 2024', date: '2024-11-15', topics: ['AI', 'ML', 'Deep Learning'] },
            { name: 'Tech Career Fair', date: '2024-11-20', topics: ['Networking', 'Jobs'] },
          ])
          .catch(() => ({ recommendations: 'Attend AI and tech networking events.' })),
      ]);

      setRecommendations({
        alumni: (alumniRec as any).recommendations || (alumniRec as any).advice || '',
        mentors: (mentorRec as any).suggestions || (mentorRec as any).advice || '',
        events: (eventRec as any).recommendations || (eventRec as any).advice || '',
      });
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI recommendations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs defaultValue="alumni" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="alumni">
                <Users className="h-4 w-4 mr-2" />
                Alumni
              </TabsTrigger>
              <TabsTrigger value="mentors">
                <GraduationCap className="h-4 w-4 mr-2" />
                Mentors
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alumni" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI Insights
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {recommendations.alumni || 'Loading recommendations...'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Sarah Johnson',
                    role: 'Senior ML Engineer',
                    company: 'Google',
                    image: '/lovable-uploads/537b6c39-73ec-44a2-9243-941aeab7b27e.png',
                  },
                  {
                    name: 'Emily Rodriguez',
                    role: 'Data Scientist',
                    company: 'Meta',
                    image: '/lovable-uploads/8ee7877a-cbd3-4121-a549-d044b60c6f6f.png',
                  },
                ].map((alumni) => (
                  <div
                    key={alumni.name}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={alumni.image} />
                      <AvatarFallback>{alumni.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{alumni.name}</p>
                      <p className="text-xs text-gray-600">
                        {alumni.role} at {alumni.company}
                      </p>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  AI Insights
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {recommendations.mentors || 'Loading recommendations...'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Dr. James Wilson', expertise: 'AI Research', experience: '15 years' },
                  { name: 'Lisa Park', expertise: 'Software Engineering', experience: '10 years' },
                ].map((mentor) => (
                  <div
                    key={mentor.name}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar>
                      <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{mentor.name}</p>
                      <p className="text-xs text-gray-600">{mentor.expertise}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {mentor.experience}
                      </Badge>
                    </div>
                    <Button size="sm">Request</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  AI Insights
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {recommendations.events || 'Loading recommendations...'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'AI Summit 2024', date: 'Nov 15, 2024', location: 'Virtual' },
                  { name: 'Tech Career Fair', date: 'Nov 20, 2024', location: 'San Francisco' },
                ].map((event) => (
                  <div
                    key={event.name}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{event.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {event.location}
                        </Badge>
                      </div>
                      <Button size="sm">Register</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={loadRecommendations}
          disabled={loading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Refresh Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};
