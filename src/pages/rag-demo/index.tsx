import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgenticRAGChat from '@/components/AgenticRAGChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BookOpen, Network, Calendar, Zap } from 'lucide-react';
import { AgentType } from '@/hooks/useRAGAgent';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/use-toast';

const RAGDemo = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('career_strategist');
  const { indexAllProfiles, loading } = useKnowledgeBase();
  const { toast } = useToast();

  const handleIndexProfiles = async () => {
    const result = await indexAllProfiles();
    if (result) {
      toast({
        title: 'Success',
        description: `Indexed ${result.indexed} profiles successfully!`,
      });
    }
  };

  const agents: Array<{ type: AgentType; icon: any; title: string; description: string }> = [
    {
      type: 'career_strategist',
      icon: Brain,
      title: 'Career Strategist',
      description: 'Get expert career advice and strategic planning',
    },
    {
      type: 'mentor_matcher',
      icon: Sparkles,
      title: 'Mentor Matcher',
      description: 'Find your perfect mentor match',
    },
    {
      type: 'interview_coach',
      icon: BookOpen,
      title: 'Interview Coach',
      description: 'Prepare for interviews with AI coaching',
    },
    {
      type: 'network_analyzer',
      icon: Network,
      title: 'Network Analyzer',
      description: 'Analyze and optimize your professional network',
    },
    {
      type: 'event_curator',
      icon: Calendar,
      title: 'Event Curator',
      description: 'Get personalized event recommendations',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">Powered by Advanced RAG AI</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Agentic AI Assistant</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of alumni networking with our multi-agent RAG system.
              Each AI agent specializes in different aspects of your career journey.
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <Button
              onClick={handleIndexProfiles}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? 'Indexing...' : 'Index All Profiles'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => {
              const AgentIcon = agent.icon;
              return (
                <Card
                  key={agent.type}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedAgent === agent.type
                      ? 'border-primary ring-2 ring-primary/20'
                      : ''
                  }`}
                  onClick={() => setSelectedAgent(agent.type)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <AgentIcon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{agent.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-2">
            <CardContent className="p-6">
              <AgenticRAGChat agentType={selectedAgent} />
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vector Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uses pgvector for semantic similarity search across 1000s of documents
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Episodic Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Remembers conversation context across sessions for personalized advice
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Multi-Agent System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Specialized AI agents for different aspects of your career journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RAGDemo;
