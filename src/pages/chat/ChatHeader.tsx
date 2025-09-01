
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Video, Info, Users } from "lucide-react";
import { ChatContact } from "@/hooks/useRealtimeChat";
import { Group } from "./chatTypes";

interface ChatHeaderProps {
  activeChat: string;
  isMobile: boolean;
  onBack: () => void;
  contacts: ChatContact[];
  groups: Group[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeChat,
  isMobile,
  onBack,
  contacts,
  groups,
}) => {
  const isGroup = activeChat.startsWith("g");
  const contact = contacts.find((c) => c.id === activeChat);
  const group = groups.find((g) => g.id === activeChat);

  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between animate-fade-in">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="h-10 w-10 bg-nexus-primary/10 rounded-full flex items-center justify-center text-lg mr-3">
          {isGroup ? <Users size={20} /> : contact?.avatar || "👤"}
        </div>
        <div>
          <h3 className="font-medium">
            {isGroup ? group?.name : contact?.name}
          </h3>
          <p className="text-sm text-gray-500">
            {isGroup
              ? `${group?.members} members`
              : contact?.status === "online"
              ? "Online"
              : contact?.status === "away"
              ? "Away"
              : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
