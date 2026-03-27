import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  connect() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No access token found');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Re-emit events to registered listeners
    this.socket.onAny((eventName, ...args) => {
      const eventListeners = this.listeners.get(eventName);
      if (eventListeners) {
        eventListeners.forEach((callback) => callback(...args));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  }

  // Message-specific methods
  sendMessage(receiverId: string, content: string) {
    this.emit('send-message', { receiverId, content });
  }

  typingStart(conversationId: string, receiverId: string) {
    this.emit('typing-start', { conversationId, receiverId });
  }

  typingStop(conversationId: string, receiverId: string) {
    this.emit('typing-stop', { conversationId, receiverId });
  }

  markAsRead(conversationId: string, otherUserId: string) {
    this.emit('mark-as-read', { conversationId, otherUserId });
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
