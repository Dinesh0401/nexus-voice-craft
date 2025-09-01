import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MessageSquare, Loader2 } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useRealtimeChat, type ChatContact, type ChatMessage } from "@/hooks/useRealtimeChat";
import { Group } from "./chatTypes";
const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [activeChatType, setActiveChatType] = useState<'contact' | 'group'>('contact');
  const [groups] = useState<Group[]>([{
    id: "g1",
    name: "Software Development",
    members: 24,
    lastActivity: "10 minutes ago"
  }, {
    id: "g2",
    name: "Business Network",
    members: 42,
    lastActivity: "1 hour ago"
  }, {
    id: "g3",
    name: "Class of 2020",
    members: 68,
    lastActivity: "Yesterday"
  }, {
    id: "g4",
    name: "Career Transitions",
    members: 31,
    lastActivity: "2 days ago"
  }]);

  const { contacts, messages, loading, currentUserId, sendMessage, loadMessages } = useRealtimeChat();
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Load messages when selecting a chat
  useEffect(() => {
    if (activeChat && activeChatType === 'contact') {
      const contact = contacts.find(c => c.id === activeChat);
      if (contact?.conversation_id) {
        loadMessages(contact.conversation_id);
      }
    }
  }, [activeChat, activeChatType, contacts, loadMessages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, activeChat]);
  const formatMessageTime = (date: Date) => date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || activeChatType !== 'contact') return;

    const contact = contacts.find(c => c.id === activeChat);
    if (!contact?.conversation_id) return;

    await sendMessage(contact.conversation_id, message.trim());
    setMessage("");
  };
  const handleSelectChat = (id: string, type: 'contact' | 'group' = 'contact') => {
    setActiveChat(id);
    setActiveChatType(type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status: ChatMessage["status"]) => {
    switch (status) {
      case "sending":
        return <span className="h-3 w-3 text-gray-400">🕓</span>;
      case "sent":
        return <div className="h-3 w-3 text-gray-400">✓</div>;
      case "delivered":
        return <div className="h-3 w-3 text-gray-400">✓✓</div>;
      case "read":
        return <div className="h-3 w-3 text-blue-500">✓✓</div>;
      default:
        return null;
    }
  };
  return <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow py-6 px-4 md:px-8 bg-green-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-display mb-6 animate-fade-in text-slate-400 font-bold">Chat</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col md:flex-row animate-scale-in">
              {loading ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-nexus-primary" />
                    <p className="text-gray-600">Loading conversations...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Sidebar */}
                  <ChatSidebar 
                    contacts={contacts} 
                    groups={groups} 
                    activeChat={activeChat} 
                    isMobile={isMobile} 
                    onSelectChat={(id) => handleSelectChat(id, 'contact')} 
                  />
                  
                  {/* Chat Area */}
                  <div className={`flex-1 flex flex-col ${activeChat && isMobile ? "block" : "hidden md:flex"}`}>
                    {activeChat ? (
                      <>
                        <ChatHeader 
                          activeChat={activeChat} 
                          isMobile={isMobile} 
                          onBack={() => setActiveChat(null)} 
                          contacts={contacts} 
                          groups={groups} 
                        />
                        <ChatMessages 
                          messages={activeChatType === 'contact' && activeChat ? 
                            messages[contacts.find(c => c.id === activeChat)?.conversation_id || ''] || [] : []} 
                          activeChat={activeChat} 
                          contacts={contacts} 
                          messageEndRef={messageEndRef} 
                          formatMessageTime={formatMessageTime} 
                          getMessageStatusIcon={getMessageStatusIcon} 
                        />
                        {activeChatType === 'contact' && (
                          <ChatInput 
                            message={message} 
                            onMessageChange={setMessage} 
                            onSendMessage={handleSendMessage} 
                            onKeyPress={handleKeyPress} 
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-6 mx-0 bg-green-50">
                        <div className="text-center animate-scale-in">
                          <div className="mx-auto h-16 w-16 bg-nexus-primary/10 rounded-full flex items-center justify-center mb-4 animate-smooth-bounce">
                            <MessageSquare className="h-8 w-8 text-nexus-primary" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
                          <p className="text-gray-600 max-w-md mx-auto mb-6">
                            {currentUserId ? 
                              "Connect with alumni mentors, fellow students, and industry professionals through direct messages or group chats." :
                              "Please sign in to start chatting with alumni and mentors."
                            }
                          </p>
                          {!currentUserId && (
                            <button className="bg-nexus-primary hover:bg-nexus-primary/90 text-white transition-all duration-200 hover:scale-105 rounded-md px-4 py-2 text-base font-medium">
                              Sign In
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>;
};
export default ChatPage;