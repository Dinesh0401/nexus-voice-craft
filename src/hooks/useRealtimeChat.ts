import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface ChatContact {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  avatar: string;
  unread: number;
  lastMessage: string;
  typing?: boolean;
  conversation_id?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  sender_id: string;
}

export const useRealtimeChat = () => {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const subscriptionsRef = useRef<{ messages?: any; profiles?: any }>({});

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      } else {
        // No user signed in, stop loading
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  // Load conversations and contacts
  const loadContacts = useCallback(async () => {
    if (!currentUserId) return;

    try {
      // Get conversations where current user is a participant
      const { data: participations } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations(
            id,
            name,
            is_group,
            updated_at
          )
        `)
        .eq('user_id', currentUserId);

      if (!participations) return;

      const contactsData: ChatContact[] = [];

      for (const participation of participations) {
        const conversation = participation.conversations;
        if (!conversation) continue;

        // Get other participants for direct chats
        if (!conversation.is_group) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversation.id)
            .neq('user_id', currentUserId);

          if (otherParticipants && otherParticipants[0]) {
            // Get profile data separately
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url, is_online, status')
              .eq('id', otherParticipants[0].user_id)
              .single();

            if (profileData) {
              // Get last message
              const { data: lastMessageData } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('conversation_id', conversation.id)
                .order('created_at', { ascending: false })
                .limit(1);

              // Get unread count
              const { count: unreadCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conversation.id)
                .neq('sender_id', currentUserId);

              contactsData.push({
                id: otherParticipants[0].user_id,
                name: profileData.full_name || 'Unknown User',
                status: profileData.is_online ? 'online' : 'offline',
                avatar: profileData.avatar_url || '👤',
                unread: unreadCount || 0,
                lastMessage: lastMessageData?.[0]?.content || 'No messages yet',
                conversation_id: conversation.id
              });
            }
          }
        } else {
          // Handle group chats
          contactsData.push({
            id: conversation.id,
            name: conversation.name || 'Group Chat',
            status: 'online',
            avatar: '👥',
            unread: 0,
            lastMessage: 'Group conversation',
            conversation_id: conversation.id
          });
        }
      }

      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentUserId, toast]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          message_type
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        const formattedMessages: ChatMessage[] = messagesData.map(msg => ({
          id: msg.id,
          text: msg.content || '',
          sender: msg.sender_id === currentUserId ? 'user' : 'other',
          timestamp: new Date(msg.created_at || ''),
          status: 'read',
          sender_id: msg.sender_id || ''
        }));

        setMessages(prev => ({
          ...prev,
          [conversationId]: formattedMessages
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  }, [currentUserId, toast]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: content.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Optimistically add the message
      const optimisticMessage: ChatMessage = {
        id: newMessage.id,
        text: content.trim(),
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
        sender_id: currentUserId
      };

      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), optimisticMessage]
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [currentUserId, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentUserId) return;

    // Clean up any existing subscriptions first
    if (subscriptionsRef.current.messages) {
      supabase.removeChannel(subscriptionsRef.current.messages);
    }
    if (subscriptionsRef.current.profiles) {
      supabase.removeChannel(subscriptionsRef.current.profiles);
    }

    // Create unique channel names with timestamp to avoid conflicts
    const timestamp = Date.now();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`chat-messages-${currentUserId}-${timestamp}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only add if it's not from current user (to avoid duplicates)
          if (newMessage.sender_id !== currentUserId) {
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              text: newMessage.content || '',
              sender: 'other',
              timestamp: new Date(newMessage.created_at || ''),
              status: 'delivered',
              sender_id: newMessage.sender_id || ''
            };

            setMessages(prev => ({
              ...prev,
              [newMessage.conversation_id || '']: [
                ...(prev[newMessage.conversation_id || ''] || []),
                formattedMessage
              ]
            }));

            // Show toast notification
            toast({
              title: "New message",
              description: newMessage.content?.substring(0, 50) + "...",
            });
          }
        }
      )
      .subscribe();

    // Subscribe to profile updates (online status)
    const profileSubscription = supabase
      .channel(`chat-profiles-${currentUserId}-${timestamp}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const updatedProfile = payload.new as Profile;
          
          setContacts(prev => prev.map(contact => 
            contact.id === updatedProfile.id 
              ? { 
                  ...contact, 
                  status: updatedProfile.is_online ? 'online' : 'offline' 
                }
              : contact
          ));
        }
      )
      .subscribe();

    // Store subscriptions in ref for cleanup
    subscriptionsRef.current = {
      messages: messageSubscription,
      profiles: profileSubscription
    };

    return () => {
      if (subscriptionsRef.current.messages) {
        supabase.removeChannel(subscriptionsRef.current.messages);
      }
      if (subscriptionsRef.current.profiles) {
        supabase.removeChannel(subscriptionsRef.current.profiles);
      }
      subscriptionsRef.current = {};
    };
  }, [currentUserId]);

  // Load initial data
  useEffect(() => {
    if (currentUserId) {
      loadContacts();
    }
  }, [currentUserId, loadContacts]);

  return {
    contacts,
    messages,
    loading,
    currentUserId,
    sendMessage,
    loadMessages,
    loadContacts
  };
};