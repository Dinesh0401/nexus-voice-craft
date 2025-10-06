import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Connection {
  id: string;
  connected_user_id: string;
  full_name: string;
  avatar_url: string;
  is_online: boolean;
  status: string;
}

export interface ConnectionRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_avatar: string;
  created_at: string;
}

export interface UserSearchResult {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
  is_online: boolean;
  bio?: string;
  connection_status?: 'none' | 'pending' | 'accepted';
}

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const connectionsChannelRef = useRef<any>(null);

  const loadConnections = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's connections using the database function
      const { data: connectionsData, error: connectionsError } = await supabase
        .rpc('get_user_connections', { user_uuid: user.id });

      if (connectionsError) throw connectionsError;

      // Map the data to match our interface
      const formattedConnections = connectionsData?.map(conn => ({
        ...conn,
        id: conn.connection_id
      })) || [];

      setConnections(formattedConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadConnectionRequests = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get pending connection requests sent to this user
      const { data: requestsData, error: requestsError } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          created_at,
          profiles!connections_requester_id_fkey(full_name, avatar_url)
        `)
        .eq('recipient_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      const formattedRequests = requestsData?.map(req => ({
        id: req.id,
        requester_id: req.requester_id,
        requester_name: (req.profiles as any)?.full_name || 'Unknown User',
        requester_avatar: (req.profiles as any)?.avatar_url || '',
        created_at: req.created_at
      })) || [];

      setConnectionRequests(formattedRequests);
    } catch (error) {
      console.error('Error loading connection requests:', error);
      toast({
        title: "Error",
        description: "Failed to load connection requests",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getAllUsers = useCallback(async (): Promise<UserSearchResult[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all users with their profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, username, is_online, bio')
        .neq('id', user.id) // Exclude current user
        .order('is_online', { ascending: false })
        .order('full_name', { ascending: true });

      if (usersError) throw usersError;

      // Check connection status for each user
      const userIds = usersData?.map(u => u.id) || [];
      const { data: connectionsData } = await supabase
        .from('connections')
        .select('recipient_id, requester_id, status')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .in('requester_id', [...userIds, user.id])
        .in('recipient_id', [...userIds, user.id]);

      const results: UserSearchResult[] = usersData?.map(profile => {
        const connection = connectionsData?.find(c => 
          (c.requester_id === user.id && c.recipient_id === profile.id) ||
          (c.recipient_id === user.id && c.requester_id === profile.id)
        );

        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown User',
          avatar_url: profile.avatar_url || '',
          username: profile.username || '',
          is_online: profile.is_online || false,
          bio: (profile as any).bio || '',
          connection_status: connection?.status === 'accepted' ? 'accepted' : 
                           connection?.status === 'pending' ? 'pending' : 'none'
        };
      }) || [];

      return results;
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const searchUsers = useCallback(async (searchTerm: string): Promise<UserSearchResult[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !searchTerm.trim()) return [];

      // Search for users by name or username
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, username, is_online, bio')
        .neq('id', user.id) // Exclude current user
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(20);

      if (usersError) throw usersError;

      // Check connection status for each user
      const userIds = usersData?.map(u => u.id) || [];
      const { data: connectionsData } = await supabase
        .from('connections')
        .select('recipient_id, requester_id, status')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .in('requester_id', [...userIds, user.id])
        .in('recipient_id', [...userIds, user.id]);

      const results: UserSearchResult[] = usersData?.map(profile => {
        const connection = connectionsData?.find(c => 
          (c.requester_id === user.id && c.recipient_id === profile.id) ||
          (c.recipient_id === user.id && c.requester_id === profile.id)
        );

        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown User',
          avatar_url: profile.avatar_url || '',
          username: profile.username || '',
          is_online: profile.is_online || false,
          bio: (profile as any).bio || '',
          connection_status: connection?.status === 'accepted' ? 'accepted' : 
                           connection?.status === 'pending' ? 'pending' : 'none'
        };
      }) || [];

      return results;
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const sendConnectionRequest = useCallback(async (recipientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          recipient_id: recipientId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request sent successfully",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    }
  }, [toast]);

  const acceptConnectionRequest = useCallback(async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request accepted",
      });

      // Reload data
      loadConnections();
      loadConnectionRequests();
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    }
  }, [toast, loadConnections, loadConnectionRequests]);

  const rejectConnectionRequest = useCallback(async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request rejected",
      });

      loadConnectionRequests();
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection request",
        variant: "destructive",
      });
    }
  }, [toast, loadConnectionRequests]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadConnections(), loadConnectionRequests()]);
      setLoading(false);

      // After initial load, set up realtime with robust single-subscription handling
      const { data: { user } } = await supabase.auth.getUser();
      // Clean any existing channel first (StrictMode safe)
      if (connectionsChannelRef.current) {
        try { connectionsChannelRef.current.unsubscribe?.(); } catch {}
        supabase.removeChannel(connectionsChannelRef.current);
        connectionsChannelRef.current = null;
      }
      if (!user) return;

      const uniqueId = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
      const channel = supabase
        .channel(`connections-changes-${user.id}-${uniqueId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'connections' },
          () => {
            loadConnections();
            loadConnectionRequests();
          }
        )
        .subscribe();

      connectionsChannelRef.current = channel;
    };

    initialize();

    return () => {
      if (connectionsChannelRef.current) {
        try { connectionsChannelRef.current.unsubscribe?.(); } catch {}
        supabase.removeChannel(connectionsChannelRef.current);
        connectionsChannelRef.current = null;
      }
    };
  }, [loadConnections, loadConnectionRequests]);

  return {
    connections,
    connectionRequests,
    loading,
    getAllUsers,
    searchUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    loadConnections,
    loadConnectionRequests
  };
};