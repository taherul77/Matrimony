"use client";

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { generateUniqueKey, safeFormatTime } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead?: boolean;
  sender?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

interface RealTimeChatProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

const OptimizedRealTimeChat: React.FC<RealTimeChatProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  receiverImage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch messages
  const fetchMessages = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/simple-messages?userId=${currentUserId}&otherUserId=${receiverId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, receiverId]);

  // Initialize messaging system with robust polling fallback
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    let isComponentMounted = true;
    
    // Start with polling-first approach since Socket.IO is having issues
    const startPolling = () => {
      if (!pollingInterval && isComponentMounted) {
        console.log('🔄 Starting message polling every 3 seconds');
        setIsPolling(true);
        setIsConnected(false);
        
        pollingInterval = setInterval(async () => {
          try {
            const response = await fetch(`/api/simple-messages?userId=${currentUserId}&otherUserId=${receiverId}`);
            if (response.ok && isComponentMounted) {
              const data = await response.json();
              setMessages(data.messages || []);
            }
          } catch (error) {
            console.error('Polling error:', error);
          }
        }, 3000);
      }
    };

    // Try Socket.IO first, but fallback to polling quickly if it fails
    const trySocketIO = async () => {
      try {
        console.log('🚀 Attempting Socket.IO connection...');

        // Pre-hit the socket endpoint to ensure the server initializes
        try {
          await fetch('/api/socketio');
        } catch (e) {
          // ignore
        }

        socketRef.current = io('/', {
          path: '/api/socketio',
          addTrailingSlash: false,
          timeout: 10000,
          // Force long-polling transport to avoid websocket failures in some environments
          transports: ['polling'],
          upgrade: false,
          withCredentials: true,
        });

        const socket = socketRef.current;
        let socketConnected = false;
        // As a safety net, if still not connected after 10s, enable manual HTTP polling
        const connectionTimeout = setTimeout(() => {
          if (!socketConnected) {
            console.log('⏰ No Socket.IO connection after 10s - enabling HTTP polling fallback');
            startPolling();
          }
        }, 10000);

        socket.on('connect', () => {
          socketConnected = true;
          clearTimeout(connectionTimeout);
          console.log('✅ Socket.IO connected successfully');
          setIsConnected(true);
          
          // Clear polling when real-time connects
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            setIsPolling(false);
          }
          
          // Join the chat room
          const roomId = generateRoomId(currentUserId, receiverId);
          socket.emit('join-room', roomId);
        });

        socket.on('new-message', (message: Message) => {
          if (isComponentMounted) {
            console.log('📨 Real-time message received');
            setMessages(prev => [...prev, message]);
            scrollToBottom();
          }
        });

        socket.on('user-typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
          if (data.userId !== currentUserId && isComponentMounted) {
            setUserTyping(data.isTyping ? data.userName : null);
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('❌ Socket.IO disconnected:', reason);
          setIsConnected(false);
          // don't immediately switch to manual polling; let Socket.IO attempt reconnection
        });

        socket.on('connect_error', (error) => {
          console.log('❌ Socket.IO connect_error:', error.message);
          // allow Socket.IO to fallback to polling automatically and/or retry
        });

        socket.io.on('reconnect_attempt', (attempt) => {
          console.log('↩️ Reconnect attempt', attempt);
        });

        socket.io.on('reconnect_failed', () => {
          console.log('❌ Reconnect failed - enabling HTTP polling fallback');
          startPolling();
        });

      } catch (error) {
        console.log('❌ Socket.IO initialization failed - using polling:', error);
        startPolling();
      }
    };

    // Start with a small delay
    const initTimeout = setTimeout(() => {
      trySocketIO();
    }, 500);

    return () => {
      isComponentMounted = false;
      clearTimeout(initTimeout);
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setIsPolling(false);
      }
    };
  }, [currentUserId, receiverId]); // Remove fetchMessages from dependencies

  // Generate consistent room ID
  const generateRoomId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('-');
  };

  // Load initial messages once
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const response = await fetch(`/api/simple-messages?userId=${currentUserId}&otherUserId=${receiverId}`);
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          console.error('Failed to fetch messages:', response.status);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialMessages();
  }, [currentUserId, receiverId]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (socketRef.current && isConnected) {
      const roomId = generateRoomId(currentUserId, receiverId);
      socketRef.current.emit('typing', {
        roomId,
        userId: currentUserId,
        userName: 'You',
        isTyping: true
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current && isConnected) {
          socketRef.current.emit('typing', {
            roomId,
            userId: currentUserId,
            userName: 'You',
            isTyping: false
          });
        }
      }, 2000);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const response = await fetch('/api/simple-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: receiverId,
          content: messageContent
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Emit the message via Socket.IO for real-time delivery
        if (socketRef.current && isConnected) {
          const roomId = generateRoomId(currentUserId, receiverId);
          socketRef.current.emit('send-message', {
            roomId,
            message: data.message
          });
          console.log('📤 Message sent via Socket.IO (real-time)');
        } else {
          // If socket not connected, add message directly and opponent will get it via polling
          setMessages(prev => [...prev, data.message]);
          console.log('📤 Message sent via HTTP - opponent will see via polling');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
        setNewMessage(messageContent); // Restore message on error
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return safeFormatTime(timestamp);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
        <div className="relative">
          <img 
            src={receiverImage || '/default-avatar.png'} 
            alt={receiverName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900">{receiverName}</h3>
          <p className="text-sm text-gray-500">
            {userTyping ? `${userTyping} is typing...` : 
             isConnected ? '🚀 Real-time connected' : 
             isPolling ? '🔄 Auto-checking messages (3s)' : '⏳ Connecting...'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 
            isPolling ? 'bg-orange-500 animate-bounce' : 'bg-gray-400'
          }`} title={
            isConnected ? 'Real-time active' : 
            isPolling ? 'Auto-checking for messages' : 'Connecting...'
          }></div>
          <span className="text-xs text-gray-500">
            {isConnected ? '🚀' : isPolling ? '🔄' : '⏳'}
          </span>
        </div>
        
        {/* Connection status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-orange-500'
          }`} title={isConnected ? 'Real-time mode' : 'Polling mode'}></div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Real-time' : 'Polling'}
          </span>
          <button
            onClick={() => fetchMessages()}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh messages"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const uniqueKey = generateUniqueKey(
              'message',
              message.id,
              index,
              `${currentUserId}-${receiverId}`
            );
            
            return (
              <div
                key={uniqueKey}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {isClient && (
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                      {message.senderId === currentUserId && (
                        <span className="ml-1">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '📤'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OptimizedRealTimeChat;