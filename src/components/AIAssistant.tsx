import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, ChevronRight, Sparkles, Mic, MicOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSpeechInteraction } from '@/hooks/useSpeechInteraction';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Speech functionality
  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    isSupported: speechSupported
  } = useSpeechInteraction({
    onSpeechResult: (text) => {
      setInputValue(text);
      stopListening();
    },
    onSpeakingStatusChange: (speaking) => {
      // Handle speaking status changes
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setTimeout(() => {
        setMessages([{
          id: Date.now().toString(),
          text: "Hello! I'm River, your AI assistant for the Knowledge Institute of Technology Alumni Network. I can help you find mentors, get career advice, discover events, and connect with the perfect alumni for your goals. What can I help you with today?",
          sender: 'ai',
          timestamp: new Date()
        }]);
      }, 500);
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: textToSend,
          context: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          userId
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.fallbackResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if speech is supported and not currently speaking
      if (speechSupported && !isSpeaking) {
        speak(aiMessage.text);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Unable to reach AI assistant. Please try again.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Find me a mentor in tech",
    "What networking events are coming up?",
    "Help me prepare for interviews",
    "Show me alumni in my field"
  ];

  return (
    <>
      {/* AI Assistant Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 animate-glow z-50 group"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[32rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-semibold">River AI</span>
                <p className="text-xs text-primary-foreground/80">Your Alumni Network Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message-appear`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-foreground border border-border shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-800 border border-border rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-typing-wave"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-typing-wave" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-typing-wave" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested Questions (show when no messages) */}
          {messages.length === 0 && (
            <div className="p-4 border-t border-border bg-gray-50/80 dark:bg-gray-800/80">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs bg-white dark:bg-gray-700 border border-border rounded-full px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t border-border bg-white dark:bg-gray-900">
            <div className="flex space-x-2">
              {speechSupported && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  className={`transition-all duration-200 ${isListening ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <ChevronRight className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
              {speechSupported && (
                <span className={isSpeaking ? 'text-primary animate-pulse' : ''}>
                  {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Voice enabled'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;