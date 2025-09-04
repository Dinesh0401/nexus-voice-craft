import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Users, Search, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatContact } from "@/hooks/useRealtimeChat";
import { Group } from "./chatTypes";
import { useConnections } from "@/hooks/useConnections";
import AddConnectionDialog from "@/components/chat/AddConnectionDialog";
import ConnectionRequests from "@/components/chat/ConnectionRequests";

interface SidebarProps {
  contacts: ChatContact[];
  groups: Group[];
  activeChat: string | null;
  isMobile: boolean;
  onSelectChat: (id: string) => void;
  onStartConversation: (userId: string) => void;
}

const ChatSidebar: React.FC<SidebarProps> = ({
  contacts,
  groups,
  activeChat,
  isMobile,
  onSelectChat,
  onStartConversation
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { connections, connectionRequests } = useConnections();

  // Filter connections based on search
  const filteredConnections = connections.filter(connection =>
    connection.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter existing contacts based on search  
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${activeChat && isMobile ? "hidden" : "block"} w-full md:w-80 border-r border-gray-200`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex gap-2">
            <ConnectionRequests />
            <AddConnectionDialog />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200" size={18} />
          <Input 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-nexus-primary/20" 
          />
        </div>
      </div>
      
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="contacts" className="flex items-center justify-center">
            <User className="mr-2 h-4 w-4" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center justify-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center justify-center">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  activeChat === contact.id ? "bg-gray-50" : ""
                }`} 
                onClick={() => onSelectChat(contact.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start animate-fade-in">
                  <div className="relative mr-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="bg-nexus-primary/10 text-nexus-primary">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
                      contact.status === "online" ? "bg-green-500" : 
                      contact.status === "away" ? "bg-amber-500" : "bg-gray-400"
                    } border-2 border-white transition-all duration-300`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.unread > 0 && (
                        <Badge className="bg-nexus-primary text-white text-xs font-semibold rounded-full h-5 min-w-5 flex items-center justify-center px-1 animate-smooth-bounce">
                          {contact.unread}
                        </Badge>
                      )}
                    </div>
                    {contact.typing ? (
                      <p className="text-sm text-nexus-primary font-medium">typing...</p>
                    ) : (
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                <p>No active chats</p>
                <p className="text-sm mt-1">Start a conversation with your connections</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="connections" className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {filteredConnections.map((connection, index) => (
              <div 
                key={connection.id} 
                className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onStartConversation(connection.connected_user_id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start animate-fade-in">
                  <div className="relative mr-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={connection.avatar_url} alt={connection.full_name} />
                      <AvatarFallback className="bg-nexus-primary/10 text-nexus-primary">
                        {connection.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
                      connection.is_online ? "bg-green-500" : "bg-gray-400"
                    } border-2 border-white transition-all duration-300`}></div>
                  </div>
                   <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{connection.full_name}</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartConversation(connection.connected_user_id);
                        }}
                      >
                        Message
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {connection.is_online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredConnections.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No connections yet</p>
                <p className="text-sm mt-1">Add connections to start chatting</p>
                <AddConnectionDialog 
                  trigger={
                    <Button className="mt-3" size="sm">
                      Add Connection
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {groups.map(group => (
              <div 
                key={group.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  activeChat === group.id ? "bg-gray-50" : ""
                }`} 
                onClick={() => onSelectChat(group.id)}
              >
                <div className="flex items-start">
                  <div className="mr-3">
                    <div className="h-10 w-10 bg-nexus-primary rounded-full flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{group.name}</h3>
                    <div className="flex text-sm text-gray-500">
                      <span className="mr-2">{group.members} members</span>
                      <span>Last active: {group.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ChatSidebar;