import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import redis from './config/redis';
import { setupMessageSocket } from './sockets/message.socket';

const httpServer = createServer(app);

// Socket.io setup for real-time messaging
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

// Setup message socket handlers
setupMessageSocket(io);

// Start server
const PORT = env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 Server is running!');
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`🌐 Server URL: ${env.API_URL}`);
  console.log(`📝 API Documentation: ${env.API_URL}/api/v1/health`);
  console.log('');
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');

  httpServer.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      await prisma.$disconnect();
      console.log('✅ Database connection closed');

      await redis.quit();
      console.log('✅ Redis connection closed');

      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default httpServer;
