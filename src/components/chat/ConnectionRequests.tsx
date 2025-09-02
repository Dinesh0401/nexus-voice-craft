import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Bell } from 'lucide-react';
import { useConnections } from '@/hooks/useConnections';

interface ConnectionRequestsProps {
  trigger?: React.ReactNode;
}

const ConnectionRequests: React.FC<ConnectionRequestsProps> = ({ trigger }) => {
  const { connectionRequests, acceptConnectionRequest, rejectConnectionRequest } = useConnections();

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2 relative">
      <Bell className="h-4 w-4" />
      Requests
      {connectionRequests.length > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {connectionRequests.length}
        </Badge>
      )}
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connection Requests</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {connectionRequests.length > 0 ? (
            connectionRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.requester_avatar} alt={request.requester_name} />
                    <AvatarFallback>
                      {request.requester_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{request.requester_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acceptConnectionRequest(request.id)}
                    className="text-xs gap-1"
                  >
                    <UserCheck className="h-3 w-3" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectConnectionRequest(request.id)}
                    className="text-xs gap-1 text-red-600 hover:text-red-700"
                  >
                    <UserX className="h-3 w-3" />
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No connection requests</p>
              <p className="text-sm">New requests will appear here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionRequests;