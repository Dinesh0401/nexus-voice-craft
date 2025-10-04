import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;

      if (userId) {
        const token = localStorage.getItem('auth_token');
        this.socket?.emit('authenticate', { userId, token });
        this.socket?.emit('join-user-room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  joinChat(chatId: string) {
    this.emit('join-chat', chatId);
  }

  leaveChat(chatId: string) {
    this.emit('leave-chat', chatId);
  }

  sendMessage(chatId: string, message: any) {
    this.emit('send-message', { chatId, ...message });
  }

  onNewMessage(callback: (message: any) => void) {
    this.on('new-message', callback);
  }

  onTyping(callback: (data: any) => void) {
    this.on('user-typing', callback);
  }

  onStopTyping(callback: (data: any) => void) {
    this.on('user-stop-typing', callback);
  }

  sendTyping(chatId: string, userId: string) {
    this.emit('typing', { chatId, userId });
  }

  sendStopTyping(chatId: string, userId: string) {
    this.emit('stop-typing', { chatId, userId });
  }

  onNotification(callback: (notification: any) => void) {
    this.on('new-notification', callback);
  }

  onUnreadCount(callback: (count: number) => void) {
    this.on('unread-notifications-count', callback);
  }

  onActivityUpdate(callback: (activity: any) => void) {
    this.on('activity-feed-update', callback);
  }

  onUserStatusChange(callback: (data: any) => void) {
    this.on('user-status-change', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
