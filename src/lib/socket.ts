import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

// Global variable to store the Socket.IO server instance
let io: SocketIOServer | undefined;

// Store for managing user connections and chat rooms
const connectedUsers = new Map<string, string>(); // userId -> socketId
const userRooms = new Map<string, Set<string>>(); // userId -> Set of chatRoomIds
const onlineUsers = new Set<string>(); // Set of online userIds

export const getSocketServer = (httpServer?: NetServer): SocketIOServer => {
  if (!io && httpServer) {
    console.log('Initializing Socket.IO server...');
    
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
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
      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        
        if (userId) {
          if (!userRooms.has(userId)) {
            userRooms.set(userId, new Set());
          }
          userRooms.get(userId)?.add(roomId);
          
          console.log(`User ${userId} joined room ${roomId}`);
          
          // Notify others in the room
          socket.to(roomId).emit('user-joined', {
            userId,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle sending messages
      socket.on('send-message', (data: { roomId: string; message: any }) => {
        try {
          console.log('Broadcasting message:', data);
          
          // Emit to all users in the room
          if (io) {
            io.to(data.roomId).emit('new-message', data.message);
          }
          
        } catch (error) {
          console.error('Error broadcasting message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing', (data: { roomId: string; userId: string; userName: string; isTyping: boolean }) => {
        socket.to(data.roomId).emit('user-typing', {
          userId: data.userId,
          userName: data.userName,
          isTyping: data.isTyping
        });
      });

      // Handle user going online
      socket.on('user:online', (data: { userId: string }) => {
        onlineUsers.add(data.userId);
        
        // Broadcast to all connected clients
        socket.broadcast.emit('user:status', {
          userId: data.userId,
          isOnline: true,
          timestamp: new Date().toISOString()
        });
      });

      // Handle user going offline
      socket.on('user:offline', (data: { userId: string }) => {
        onlineUsers.delete(data.userId);
        
        // Broadcast to all connected clients
        socket.broadcast.emit('user:status', {
          userId: data.userId,
          isOnline: false,
          timestamp: new Date().toISOString()
        });
      });

      // Handle disconnect
      socket.on('disconnect', (reason: string) => {
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
      socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.IO server initialized successfully');
  }

  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }

  return io;
};

// Helper function to emit events to specific rooms
export const emitToRoom = (roomId: string, event: string, data: any) => {
  if (io) {
    io.to(roomId).emit(event, data);
  }
};

// Helper function to emit events to specific users
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io && connectedUsers.has(userId)) {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  }
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

// Get all online users
export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};

export { io };