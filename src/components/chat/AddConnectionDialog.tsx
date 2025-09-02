import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { useConnections, type UserSearchResult } from '@/hooks/useConnections';
import { useDebounce } from '@/hooks/useDebounce';

interface AddConnectionDialogProps {
  trigger?: React.ReactNode;
}

const AddConnectionDialog: React.FC<AddConnectionDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  
  const { searchUsers, sendConnectionRequest } = useConnections();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      const results = await searchUsers(debouncedSearchTerm);
      setSearchResults(results);
      setSearching(false);
    };

    performSearch();
  }, [debouncedSearchTerm, searchUsers]);

  const handleSendRequest = async (userId: string) => {
    await sendConnectionRequest(userId);
    // Update the search results to reflect the new status
    const results = await searchUsers(debouncedSearchTerm);
    setSearchResults(results);
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

          <div className="max-h-64 overflow-y-auto space-y-2">
            {searching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
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
              ))
            ) : searchTerm.trim() && !searching ? (
              <div className="text-center p-4 text-muted-foreground">
                No users found matching "{searchTerm}"
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Search for users to connect with them
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionDialog;