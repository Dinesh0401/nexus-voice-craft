import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Brain, Sparkles, BookOpen } from 'lucide-react';
import { useRAGAgent, AgentType, RAGMessage } from '@/hooks/useRAGAgent';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface AgenticRAGChatProps {
  agentType?: AgentType;
  initialMessage?: string;
}

const agentConfig = {
  career_strategist: {
    title: 'Career Strategist',
    icon: Brain,
    color: 'text-primary',
    description: 'Expert in career path analysis and strategic planning',
  },
  mentor_matcher: {
    title: 'Mentor Matcher',
    icon: Sparkles,
    color: 'text-secondary',
    description: 'Specializes in finding perfect mentor-mentee matches',
  },
  interview_coach: {
    title: 'Interview Coach',
    icon: BookOpen,
    color: 'text-accent',
    description: 'Provides expert interview preparation guidance',
  },
  network_analyzer: {
    title: 'Network Analyzer',
    icon: Brain,
    color: 'text-primary',
    description: 'Analyzes professional networks and connections',
  },
  event_curator: {
    title: 'Event Curator',
    icon: Sparkles,
    color: 'text-secondary',
    description: 'Recommends personalized networking events',
  },
};

const AgenticRAGChat: React.FC<AgenticRAGChatProps> = ({
  agentType = 'career_strategist',
  initialMessage,
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<(RAGMessage & { sources?: any[] })[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { query, loading, error, conversationHistory, loadConversation } = useRAGAgent(agentType);

  const config = agentConfig[agentType];
  const AgentIcon = config.icon;

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    if (conversationHistory.length > 0) {
      setMessages(conversationHistory);
    }
  }, [conversationHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Query the RAG agent
    const response = await query(userMessage);

    if (response) {
      // Add assistant response with sources
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          sources: response.sources,
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-background ${config.color}`}>
            <AgentIcon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {config.title}
              <Badge variant="secondary" className="text-xs">
                AI-Powered
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center p-8"
              >
                <AgentIcon className={`h-16 w-16 mb-4 ${config.color}`} />
                <h3 className="text-lg font-semibold mb-2">
                  Start a conversation with {config.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Ask questions about your career, get personalized advice, or explore opportunities.
                  Your conversation is powered by advanced AI with deep knowledge of the alumni network.
                </p>
              </motion.div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-semibold mb-2 opacity-70">Sources:</p>
                        <div className="space-y-1">
                          {msg.sources.map((source, sIdx) => (
                            <div key={sIdx} className="text-xs opacity-60">
                              <Badge variant="outline" className="text-xs mr-2">
                                {source.content_type}
                              </Badge>
                              <span>{source.content.substring(0, 100)}...</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${config.title}...`}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading || !message.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgenticRAGChat;
