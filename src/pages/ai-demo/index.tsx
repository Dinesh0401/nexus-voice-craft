import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedAIChat } from '@/components/EnhancedAIChat';
import { AISmartRecommendations } from '@/components/AISmartRecommendations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { aiAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  Bot,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  MessageSquare,
  Search,
  Award,
} from 'lucide-react';
import SEO from '@/components/SEO';

const AIDemoPage = () => {
  const [careerQuery, setCareerQuery] = useState('');
  const [careerAdvice, setCareerAdvice] = useState('');
  const [profileAnalysis, setProfileAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCareerAdvice = async () => {
    if (!careerQuery.trim()) return;

    setLoading(true);
    try {
      const response = await aiAPI.getCareerAdvice(careerQuery, {
        currentRole: 'Student',
        interests: ['Technology', 'Innovation'],
      });
      setCareerAdvice(response.advice);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get career advice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileAnalysis = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.analyzeProfile({
        name: 'John Doe',
        role: 'Computer Science Student',
        skills: ['React', 'Python', 'Java'],
        experience: 'Entry Level',
        bio: 'Passionate about software development and AI',
      });
      setProfileAnalysis(response.analysis);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Bot,
      title: 'AI Chat Assistant',
      description: 'Conversational AI that helps with career questions, networking advice, and more',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Brain,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions for alumni connections, mentors, and events',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Lightbulb,
      title: 'Career Insights',
      description: 'Personalized career advice based on your profile and aspirations',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Target,
      title: 'Profile Analysis',
      description: 'AI-driven feedback to improve your professional profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <>
      <SEO
        title="AI-Powered Features - Alumni Nexus"
        description="Experience cutting-edge AI technology for career guidance, networking recommendations, and personalized insights"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-blue-600">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Open-Source AI
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Career Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of alumni networking with advanced AI capabilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="chat" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <TrendingUp className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="career">
                <Lightbulb className="h-4 w-4 mr-2" />
                Career Advice
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Award className="h-4 w-4 mr-2" />
                Profile Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <EnhancedAIChat />
              </motion.div>
            </TabsContent>

            <TabsContent value="recommendations">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AISmartRecommendations />
              </motion.div>
            </TabsContent>

            <TabsContent value="career">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      AI Career Advisor
                    </CardTitle>
                    <CardDescription>
                      Get personalized career advice powered by AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        What career question do you have?
                      </label>
                      <Textarea
                        value={careerQuery}
                        onChange={(e) => setCareerQuery(e.target.value)}
                        placeholder="e.g., How do I transition from academia to industry? What skills should I focus on for AI/ML roles?"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleCareerAdvice} disabled={loading || !careerQuery.trim()}>
                      {loading ? 'Generating...' : 'Get AI Advice'}
                    </Button>

                    {careerAdvice && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          AI Advice
                        </h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{careerAdvice}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      AI Profile Analyzer
                    </CardTitle>
                    <CardDescription>
                      Get AI-powered feedback on your professional profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Sample Profile</h4>
                      <div className="text-sm space-y-1 text-gray-700">
                        <p><strong>Name:</strong> John Doe</p>
                        <p><strong>Role:</strong> Computer Science Student</p>
                        <p><strong>Skills:</strong> React, Python, Java</p>
                        <p><strong>Experience:</strong> Entry Level</p>
                        <p><strong>Bio:</strong> Passionate about software development and AI</p>
                      </div>
                    </div>

                    <Button onClick={handleProfileAnalysis} disabled={loading}>
                      {loading ? 'Analyzing...' : 'Analyze Profile'}
                    </Button>

                    {profileAnalysis && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          AI Analysis
                        </h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{profileAnalysis}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Powered by Open-Source AI</h3>
                <p className="mb-4 text-blue-50">
                  Our platform uses state-of-the-art open-source LLM models to provide intelligent,
                  personalized assistance for your career journey.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Meta Llama 3.2</Badge>
                  <Badge variant="secondary">Free Tier Available</Badge>
                  <Badge variant="secondary">Real-time Responses</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AIDemoPage;
