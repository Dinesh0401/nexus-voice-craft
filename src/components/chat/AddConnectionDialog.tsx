import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Loader2, MessageCircle } from 'lucide-react';
import { useConnections, type UserSearchResult, type Connection } from '@/hooks/useConnections';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddConnectionDialogProps {
  trigger?: React.ReactNode;
}

const AddConnectionDialog: React.FC<AddConnectionDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [connectionResults, setConnectionResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  
  const { connections, searchUsers, sendConnectionRequest } = useConnections();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load suggested connections when dialog opens
  useEffect(() => {
    if (open && !debouncedSearchTerm.trim()) {
      console.log('Loading suggested connections...');
      // Show existing connections as suggestions
      const suggestedConnections: UserSearchResult[] = connections
        .sort((a, b) => {
          // Sort by online status first, then by name
          if (a.is_online && !b.is_online) return -1;
          if (!a.is_online && b.is_online) return 1;
          return a.full_name.localeCompare(b.full_name);
        })
        .slice(0, 8) // Show top 8 connections
        .map(conn => ({
          id: conn.connected_user_id,
          full_name: conn.full_name,
          avatar_url: conn.avatar_url,
          username: '', // connections don't have username in this context
          is_online: conn.is_online,
          connection_status: 'accepted' as const
        }));
      
      setConnectionResults(suggestedConnections);
      setSearchResults([]);
    }
  }, [open, debouncedSearchTerm, connections]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        return; // Keep suggestions when no search term
      }

      console.log('Searching users:', debouncedSearchTerm);
      setSearching(true);
      
      // Filter existing connections by search term
      const filteredConnections: UserSearchResult[] = connections
        .filter(conn => 
          conn.full_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        .map(conn => ({
          id: conn.connected_user_id,
          full_name: conn.full_name,
          avatar_url: conn.avatar_url,
          username: '',
          is_online: conn.is_online,
          connection_status: 'accepted' as const
        }));

      // Search for other users
      const searchResultsData = await searchUsers(debouncedSearchTerm);
      
      // Exclude users that are already in connections
      const connectionUserIds = new Set(connections.map(c => c.connected_user_id));
      const nonConnectionResults = searchResultsData.filter(user => !connectionUserIds.has(user.id));

      setConnectionResults(filteredConnections);
      setSearchResults(nonConnectionResults);
      setSearching(false);
    };

    performSearch();
  }, [debouncedSearchTerm, searchUsers, connections]);

  const handleSendRequest = async (userId: string) => {
    console.log('Sending connection request to:', userId);
    await sendConnectionRequest(userId);
    // Refresh search results to reflect the new status
    if (debouncedSearchTerm.trim()) {
      const results = await searchUsers(debouncedSearchTerm);
      const connectionUserIds = new Set(connections.map(c => c.connected_user_id));
      const nonConnectionResults = results.filter(user => !connectionUserIds.has(user.id));
      setSearchResults(nonConnectionResults);
    }
  };

  const handleMessage = async (userId: string) => {
    try {
      console.log('Starting conversation with user:', userId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if conversation already exists by looking at participants
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversations!inner(*)')
        .eq('user_id', user.id);

      let conversationId: string | null = null;

      // Check if any of these conversations include the target user
      if (existingConversations) {
        for (const participant of existingConversations) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .neq('user_id', user.id);

          if (otherParticipants?.some(p => p.user_id === userId)) {
            conversationId = participant.conversation_id;
            break;
          }
        }
      }

      if (!conversationId) {
        // Create new conversation
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            type: 'direct',
            created_by: user.id
          })
          .select('id')
          .single();

        if (conversationError) throw conversationError;
        conversationId = newConversation.id;

        // Add participants
        const participants = [
          { conversation_id: conversationId, user_id: user.id },
          { conversation_id: conversationId, user_id: userId }
        ];

        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert(participants);

        if (participantsError) throw participantsError;
      }

      // Close dialog and navigate to chat
      setOpen(false);
      navigate('/chat');
      
      toast({
        title: "Success",
        description: "Opening conversation...",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  const getConnectionStatusBadge = (status?: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="secondary" className="text-xs">Connected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      default:
        return null;
    }
  };

  const renderUserCard = (user: UserSearchResult, showMessageButton: boolean = false) => (
    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url} alt={user.full_name} />
          <AvatarFallback>
            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{user.full_name}</p>
          {user.username && (
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-xs text-muted-foreground">
              {user.is_online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {getConnectionStatusBadge(user.connection_status)}
        {showMessageButton && user.connection_status === 'accepted' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMessage(user.id)}
            className="text-xs gap-1"
          >
            <MessageCircle className="h-3 w-3" />
            Message
          </Button>
        )}
        {user.connection_status === 'none' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSendRequest(user.id)}
            className="text-xs"
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );

  const defaultTrigger = (
    <Button size="sm" className="gap-2">
      <UserPlus className="h-4 w-4" />
      Add Connection
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Connection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3">
            {searching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <>
                {/* Your Connections Section */}
                {connectionResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground px-1">
                      {searchTerm.trim() ? 'Your connections' : 'Suggested connections'}
                    </h4>
                    <div className="space-y-2">
                      {connectionResults.map((user) => renderUserCard(user, true))}
                    </div>
                  </div>
                )}

                {/* People You May Know Section */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground px-1">
                      People you may know
                    </h4>
                    <div className="space-y-2">
                      {searchResults.map((user) => renderUserCard(user, false))}
                    </div>
                  </div>
                )}

                {/* Empty States */}
                {!searching && connectionResults.length === 0 && searchResults.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    {searchTerm.trim() ? (
                      <div>
                        <p className="font-medium mb-1">No users found</p>
                        <p className="text-xs">No users found matching "{searchTerm}"</p>
                      </div>
                    ) : connections.length === 0 ? (
                      <div>
                        <p className="font-medium mb-1">No connections yet</p>
                        <p className="text-xs">Search for users to find people to connect with</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium mb-1">Suggested connections</p>
                        <p className="text-xs">Search for users to find more people to connect with</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionDialog;