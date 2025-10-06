import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Search, Loader2, MessageCircle, Users, UserCheck, UserX } from 'lucide-react';
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
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [connectionResults, setConnectionResults] = useState<UserSearchResult[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { connections, getAllUsers, searchUsers, sendConnectionRequest } = useConnections();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load all connections, pending requests, and all users when dialog opens
  useEffect(() => {
    const loadConnections = async () => {
      if (!open) return;
      
      console.log('Loading all connections...');
      // Show ALL connections
      const allConnections: UserSearchResult[] = connections
        .sort((a, b) => {
          // Sort by online status first, then by name
          if (a.is_online && !b.is_online) return -1;
          if (!a.is_online && b.is_online) return 1;
          return a.full_name.localeCompare(b.full_name);
        })
        .map(conn => ({
          id: conn.connected_user_id,
          full_name: conn.full_name,
          avatar_url: conn.avatar_url,
          username: '',
          is_online: conn.is_online,
          connection_status: 'accepted' as const
        }));
      
      setConnectionResults(allConnections);
      
      // Load all users for "Find People" tab
      const users = await getAllUsers();
      setAllUsers(users);
      
      // Load pending requests
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: requests } = await supabase
          .from('connections')
          .select(`
            id,
            created_at,
            status,
            requester:requester_id(id, full_name, avatar_url),
            recipient:recipient_id(id, full_name, avatar_url)
          `)
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'pending');
        
        setPendingRequests(requests || []);
      }
    };
    
    loadConnections();
  }, [open, connections, getAllUsers]);

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

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Connection request accepted!",
      });
      
      // Refresh pending requests
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: requests } = await supabase
          .from('connections')
          .select(`
            id,
            created_at,
            status,
            requester:requester_id(id, full_name, avatar_url),
            recipient:recipient_id(id, full_name, avatar_url)
          `)
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'pending');
        
        setPendingRequests(requests || []);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Connection request rejected",
      });
      
      // Refresh pending requests
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: requests } = await supabase
          .from('connections')
          .select(`
            id,
            created_at,
            status,
            requester:requester_id(id, full_name, avatar_url),
            recipient:recipient_id(id, full_name, avatar_url)
          `)
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .eq('status', 'pending');
        
        setPendingRequests(requests || []);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection request",
        variant: "destructive",
      });
    }
  };

  const renderUserCard = (user: UserSearchResult, showMessageButton: boolean = false) => (
    <div key={user.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback>
              {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.is_online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{user.full_name}</p>
          {user.username && (
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          )}
          {user.bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-2 shrink-0">
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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connections & Network
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="gap-2">
              <UserCheck className="h-4 w-4" />
              All ({connectionResults.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Find People
            </TabsTrigger>
          </TabsList>

          {/* All Connections Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {connectionResults.length > 0 ? (
                connectionResults
                  .filter(conn => 
                    !searchTerm.trim() || 
                    conn.full_name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user) => renderUserCard(user, true))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-1">No connections yet</p>
                  <p className="text-xs">Start by finding people to connect with</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request: any) => {
                  const isReceived = request.recipient?.id !== request.requester?.id;
                  const otherUser = isReceived ? request.requester : request.recipient;
                  
                  return (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser?.avatar_url} alt={otherUser?.full_name} />
                          <AvatarFallback>
                            {otherUser?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{otherUser?.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {isReceived ? 'Sent you a connection request' : 'Waiting for response'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isReceived ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="text-xs gap-1"
                            >
                              <UserCheck className="h-3 w-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-xs gap-1"
                            >
                              <UserX className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-1">No pending requests</p>
                  <p className="text-xs">Connection requests will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Search/Find People Tab */}
          <TabsContent value="search" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for people to connect..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {searching ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : searchTerm.trim() && searchResults.length > 0 ? (
                searchResults.map((user) => renderUserCard(user, false))
              ) : !searchTerm.trim() && allUsers.length > 0 ? (
                allUsers.map((user) => renderUserCard(user, false))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-1">
                    {searchTerm.trim() ? 'No users found' : 'No users available'}
                  </p>
                  <p className="text-xs">
                    {searchTerm.trim() 
                      ? `No users found matching "${searchTerm}"` 
                      : 'Check back later for new members'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionDialog;