import { createServer } from 'node:http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Store for managing user connections and chat rooms
const connectedUsers = new Map<string, string>(); // userId -> socketId
const userRooms = new Map<string, Set<string>>(); // userId -> Set of chatRoomIds
const onlineUsers = new Set<string>(); // Set of online userIds

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],
  });

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);
    
    const userId = socket.handshake.query.userId as string;
    
    if (userId) {
      // Store user connection
      connectedUsers.set(userId, socket.id);
      onlineUsers.add(userId);
      
      console.log(`User ${userId} connected with socket ${socket.id}`);
      
      // Notify others about user coming online
      socket.broadcast.emit('user:status', {
        userId,
        isOnline: true,
        timestamp: new Date().toISOString()
      });
    }

    // Join a chat room
    socket.on('chat:join', ({ chatRoomId }) => {
      socket.join(chatRoomId);
      
      if (userId) {
        if (!userRooms.has(userId)) {
          userRooms.set(userId, new Set());
        }
        userRooms.get(userId)?.add(chatRoomId);
        
        console.log(`User ${userId} joined chat room ${chatRoomId}`);
      }
    });

    // Leave a chat room
    socket.on('chat:leave', ({ chatRoomId }) => {
      socket.leave(chatRoomId);
      
      if (userId) {
        userRooms.get(userId)?.delete(chatRoomId);
        console.log(`User ${userId} left chat room ${chatRoomId}`);
      }
    });

    // Handle new messages
    socket.on('message:send', async (data) => {
      try {
        // The message should already be saved to database by the API
        // We just need to broadcast it to the chat room
        console.log('Broadcasting message:', data);
        
        // Emit to all users in the chat room except sender
        socket.to(data.chatRoomId).emit('message:received', {
          ...data,
          timestamp: new Date().toISOString()
        });
        
        // Also emit to sender for confirmation
        socket.emit('message:sent', {
          ...data,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Error broadcasting message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', ({ chatRoomId, isTyping, userId: typingUserId }) => {
      socket.to(chatRoomId).emit('typing:received', {
        chatRoomId,
        isTyping,
        userId: typingUserId,
        timestamp: new Date().toISOString()
      });
    });

    // Handle user going online
    socket.on('user:online', ({ userId: onlineUserId }) => {
      onlineUsers.add(onlineUserId);
      
      // Broadcast to all connected clients
      socket.broadcast.emit('user:status', {
        userId: onlineUserId,
        isOnline: true,
        timestamp: new Date().toISOString()
      });
    });

    // Handle user going offline
    socket.on('user:offline', ({ userId: offlineUserId }) => {
      onlineUsers.delete(offlineUserId);
      
      // Broadcast to all connected clients
      socket.broadcast.emit('user:status', {
        userId: offlineUserId,
        isOnline: false,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Socket ${socket.id} disconnected:`, reason);
      
      if (userId) {
        // Remove user from connected users
        connectedUsers.delete(userId);
        onlineUsers.delete(userId);
        
        // Clean up user rooms
        userRooms.delete(userId);
        
        // Notify others about user going offline
        socket.broadcast.emit('user:status', {
          userId,
          isOnline: false,
          timestamp: new Date().toISOString()
        });
        
        console.log(`User ${userId} disconnected`);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Start the server
  httpServer
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running on port ${port}`);
    });

  // Handle process termination
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

// Export io instance for use in API routes
const ioInstance: SocketIOServer | null = null;

export { ioInstance };