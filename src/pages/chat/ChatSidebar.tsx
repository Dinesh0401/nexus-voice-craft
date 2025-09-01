import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { User, Users, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatContact } from "@/hooks/useRealtimeChat";
import { Group } from "./chatTypes";
interface SidebarProps {
  contacts: ChatContact[];
  groups: Group[];
  activeChat: string | null;
  isMobile: boolean;
  onSelectChat: (id: string) => void;
}
const ChatSidebar: React.FC<SidebarProps> = ({
  contacts,
  groups,
  activeChat,
  isMobile,
  onSelectChat
}) => <div className={`${activeChat && isMobile ? "hidden" : "block"} w-full md:w-80 border-r border-gray-200`}>
    <div className="p-4 border-b border-gray-200 mx-[24px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200" size={18} />
        <Input placeholder="Search contacts..." className="pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-nexus-primary/20" />
      </div>
    </div>
    <Tabs defaultValue="direct" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="direct" className="flex items-center justify-center">
          <User className="mr-2 h-4 w-4" />
          Direct
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex items-center justify-center">
          <Users className="mr-2 h-4 w-4" />
          Groups
        </TabsTrigger>
      </TabsList>
      <TabsContent value="direct" className="max-h-[500px] overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {contacts.map((contact, index) => <div key={contact.id} className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${activeChat === contact.id ? "bg-gray-50" : ""}`} onClick={() => onSelectChat(contact.id)} style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="flex items-start animate-fade-in">
                <div className="relative mr-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-nexus-primary/10 text-nexus-primary">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${contact.status === "online" ? "bg-green-500" : contact.status === "away" ? "bg-amber-500" : "bg-gray-400"} border-2 border-white transition-all duration-300`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    {contact.unread > 0 && <span className="bg-nexus-primary text-white text-xs font-semibold rounded-full h-5 min-w-5 flex items-center justify-center px-1 animate-smooth-bounce">
                        {contact.unread}
                      </span>}
                  </div>
                  {contact.typing ? <p className="text-sm text-nexus-primary font-medium">typing...</p> : <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>}
                </div>
              </div>
            </div>)}
        </div>
      </TabsContent>
      <TabsContent value="groups" className="max-h-[500px] overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {groups.map(group => <div key={group.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${activeChat === group.id ? "bg-gray-50" : ""}`} onClick={() => onSelectChat(group.id)}>
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
            </div>)}
        </div>
      </TabsContent>
    </Tabs>
  </div>;
export default ChatSidebar;