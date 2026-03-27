import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.util';
import { messageService } from '../services/message.service';

interface AuthSocket extends Socket {
  userId?: string;
}

// Store online users
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupMessageSocket = (io: Server) => {
  // Middleware for authentication
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    const userId = socket.userId!;

    console.log(`✅ User connected: ${userId}`);

    // Add user to online users
    onlineUsers.set(userId, socket.id);

    // Notify user's contacts that they're online
    socket.broadcast.emit('user-online', { userId });

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle sending messages
    socket.on('send-message', async (data: {
      receiverId: string;
      content: string;
    }) => {
      try {
        const message = await messageService.createMessage(userId, {
          receiverId: data.receiverId,
          content: data.content,
        });

        // Send to receiver if they're online
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new-message', message);
        }

        // Confirm to sender
        socket.emit('message-sent', message);
      } catch (error) {
        socket.emit('message-error', {
          error: 'Failed to send message',
        });
      }
    });

    // Handle typing indicator
    socket.on('typing-start', (data: { conversationId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', {
          conversationId: data.conversationId,
          userId,
        });
      }
    });

    socket.on('typing-stop', (data: { conversationId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-stopped-typing', {
          conversationId: data.conversationId,
          userId,
        });
      }
    });

    // Handle mark as read
    socket.on('mark-as-read', async (data: {
      conversationId: string;
      otherUserId: string;
    }) => {
      try {
        await messageService.markAsRead(userId, data.conversationId);

        // Notify other user
        const otherSocketId = onlineUsers.get(data.otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit('messages-read', {
            conversationId: data.conversationId,
            readBy: userId,
          });
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
      onlineUsers.delete(userId);

      // Notify user's contacts that they're offline
      socket.broadcast.emit('user-offline', { userId });
    });
  });

  return io;
};
