"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

interface ChatProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  isOnline?: boolean;
}

const SimpleChatWithSocketFallback: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  receiverImage,
  isOnline = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'fallback'>('connecting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Try to import and use Socket.IO, with fallback to polling
  const [socketContext, setSocketContext] = useState<any>(null);

  // Fetch messages
  const fetchMessages = React.useCallback(async () => {
    if (!chatRoomId) return;

    try {
      const response = await fetch(`/api/chat/messages?chatRoomId=${chatRoomId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

  // Polling fallback
  const startPolling = React.useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 2000); // Poll every 2 seconds
  }, [fetchMessages]);

  useEffect(() => {
    // Try to load Socket.IO context
    const loadSocketContext = async () => {
      try {
        const { useSocket } = await import('@/context/SocketContext');
        setSocketContext({ useSocket });
        setConnectionStatus('connected');
      } catch (error) {
        console.warn('Socket.IO not available, falling back to polling:', error);
        setConnectionStatus('fallback');
        // Start polling for messages
        if (chatRoomId) {
          startPolling();
        }
      }
    };

    loadSocketContext();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [chatRoomId, startPolling]);

  // Create or get chat room
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user1Id: currentUserId,
            user2Id: receiverId
          })
        });

        if (response.ok) {
          const data = await response.json();
          setChatRoomId(data.chatRoom.id);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    if (currentUserId && receiverId) {
      initializeChat();
    }
  }, [currentUserId, receiverId]);

  // Load messages when chat room is ready
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      if (connectionStatus === 'fallback') {
        startPolling();
      }
    }
  }, [chatRoomId, fetchMessages, connectionStatus, startPolling]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatRoomId || sending) return;

    try {
      setSending(true);
      
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatRoomId,
          senderId: currentUserId,
          receiverId,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to local messages immediately
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        scrollToBottom();
        
        // If using fallback, refresh messages after a short delay
        if (connectionStatus === 'fallback') {
          setTimeout(() => fetchMessages(), 500);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Live';
      case 'disconnected':
        return 'Reconnecting...';
      case 'fallback':
        return 'Basic Mode';
      default:
        return 'Offline';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'disconnected':
        return 'bg-yellow-500';
      case 'fallback':
        return 'bg-blue-500';
      default:
        return 'bg-red-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg chat-container">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
        <div className="relative">
          <img 
            src={receiverImage || '/default-avatar.png'} 
            alt={receiverName}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900">{receiverName}</h3>
          <p className="text-sm text-gray-500">
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        
        {/* Connection status indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} 
               title={getConnectionStatusText()}></div>
          <span className="text-xs text-gray-500">
            {getConnectionStatusText()}
          </span>
          {connectionStatus === 'fallback' && (
            <button
              onClick={() => fetchMessages()}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh messages"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
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
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleChatWithSocketFallback;