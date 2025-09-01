
import React, { RefObject } from "react";
import TypingIndicator from "@/components/TypingIndicator";
import { ChatContact, ChatMessage } from "@/hooks/useRealtimeChat";

interface ChatMessagesProps {
  messages: ChatMessage[];
  activeChat: string;
  contacts: ChatContact[];
  messageEndRef: RefObject<HTMLDivElement>;
  formatMessageTime: (date: Date) => string;
  getMessageStatusIcon: (status: ChatMessage["status"]) => React.ReactNode;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  activeChat,
  contacts,
  messageEndRef,
  formatMessageTime,
  getMessageStatusIcon,
}) => (
  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
    <div className="text-center text-sm text-gray-500 mb-4">Today</div>
    <div className="space-y-4">
      {messages?.map((msg, index) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-message-appear`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`relative rounded-lg p-3 shadow-sm max-w-xs md:max-w-md transition-all duration-300 hover:shadow-md ${
              msg.sender === "user"
                ? "bg-nexus-primary text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <p>{msg.text}</p>
            <div
              className={`flex items-center justify-end ${msg.sender === "user" ? "text-white/80" : "text-gray-500"} text-xs mt-1 gap-1`}
            >
              <span>{formatMessageTime(msg.timestamp)}</span>
              {msg.sender === "user" && getMessageStatusIcon(msg.status)}
            </div>
          </div>
        </div>
      ))}
      {/* Typing indicator */}
      {contacts.find((c) => c.id === activeChat)?.typing && (
        <div className="flex justify-start animate-fade-in">
          <TypingIndicator className="max-w-xs md:max-w-md" />
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  </div>
);

export default ChatMessages;
