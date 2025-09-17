"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChatRoom: (chatRoomId: string) => void;
  leaveChatRoom: (chatRoomId: string) => void;
  sendMessage: (data: any) => void;
  emitTyping: (chatRoomId: string, isTyping: boolean) => void;
  onMessageReceived: (callback: (message: any) => void) => void;
  onTypingReceived: (callback: (data: any) => void) => void;
  onUserOnlineStatus: (callback: (data: any) => void) => void;
  offMessageReceived: () => void;
  offTypingReceived: () => void;
  offUserOnlineStatus: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Add a delay to ensure the server is ready
    const initSocket = async () => {
      try {
        // First, try to initialize the Socket.IO server
        await fetch('/api/socket', { method: 'GET' });
        
        // Small delay to ensure server is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize socket connection
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
          path: '/api/socket',
          query: {
            userId
          },
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          forceNew: true,
        });

        socketInstance.on('connect', () => {
          console.log('Socket connected:', socketInstance.id);
          setIsConnected(true);
          
          // Emit user online status
          socketInstance.emit('user:online', { userId });
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setIsConnected(false);
        });

        socketInstance.on('reconnect', () => {
          console.log('Socket reconnected');
          setIsConnected(true);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
          socketInstance.emit('user:offline', { userId });
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize Socket.IO:', error);
        setIsConnected(false);
      }
    };

    initSocket();
  }, [userId]);

  const joinChatRoom = useCallback((chatRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('chat:join', { chatRoomId });
      console.log('Joined chat room:', chatRoomId);
    }
  }, [socket, isConnected]);

  const leaveChatRoom = useCallback((chatRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('chat:leave', { chatRoomId });
      console.log('Left chat room:', chatRoomId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.emit('message:send', data);
    }
  }, [socket, isConnected]);

  const emitTyping = useCallback((chatRoomId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatRoomId, isTyping, userId });
    }
  }, [socket, isConnected, userId]);

  const onMessageReceived = useCallback((callback: (message: any) => void) => {
    if (socket) {
      socket.on('message:received', callback);
    }
  }, [socket]);

  const onTypingReceived = useCallback((callback: (data: any) => void) => {
    if (socket) {
      socket.on('typing:received', callback);
    }
  }, [socket]);

  const onUserOnlineStatus = useCallback((callback: (data: any) => void) => {
    if (socket) {
      socket.on('user:status', callback);
    }
  }, [socket]);

  const offMessageReceived = useCallback(() => {
    if (socket) {
      socket.off('message:received');
    }
  }, [socket]);

  const offTypingReceived = useCallback(() => {
    if (socket) {
      socket.off('typing:received');
    }
  }, [socket]);

  const offUserOnlineStatus = useCallback(() => {
    if (socket) {
      socket.off('user:status');
    }
  }, [socket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    emitTyping,
    onMessageReceived,
    onTypingReceived,
    onUserOnlineStatus,
    offMessageReceived,
    offTypingReceived,
    offUserOnlineStatus,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for chat-specific functionality
export const useChat = (chatRoomId: string | null) => {
  const {
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    emitTyping,
    onMessageReceived,
    onTypingReceived,
    offMessageReceived,
    offTypingReceived,
    isConnected
  } = useSocket();

  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Join/leave chat room when chatRoomId changes
  useEffect(() => {
    if (chatRoomId && isConnected) {
      joinChatRoom(chatRoomId);
      
      return () => {
        leaveChatRoom(chatRoomId);
      };
    }
  }, [chatRoomId, isConnected, joinChatRoom, leaveChatRoom]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => [...prev, message]);
      }
    };

    onMessageReceived(handleNewMessage);

    return () => {
      offMessageReceived();
    };
  }, [chatRoomId, onMessageReceived, offMessageReceived]);

  // Listen for typing indicators
  useEffect(() => {
    const handleTyping = (data: any) => {
      if (data.chatRoomId === chatRoomId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return [...prev.filter(id => id !== data.userId), data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      }
    };

    onTypingReceived(handleTyping);

    return () => {
      offTypingReceived();
    };
  }, [chatRoomId, onTypingReceived, offTypingReceived]);

  const sendChatMessage = useCallback((content: string, receiverId: string, senderId: string) => {
    if (chatRoomId) {
      sendMessage({
        chatRoomId,
        content,
        receiverId,
        senderId,
      });
    }
  }, [chatRoomId, sendMessage]);

  const handleTyping = useCallback((isTyping: boolean) => {
    if (chatRoomId) {
      emitTyping(chatRoomId, isTyping);
    }
  }, [chatRoomId, emitTyping]);

  return {
    messages,
    setMessages,
    typingUsers,
    sendChatMessage,
    handleTyping,
    isConnected
  };
};