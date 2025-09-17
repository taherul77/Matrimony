"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSocket, useChat } from '@/context/SocketContext';

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

const RealTimeChat: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  receiverImage,
  isOnline = false
}) => {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [receiverOnlineStatus, setReceiverOnlineStatus] = useState(isOnline);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket.IO hooks
  const { isConnected, onUserOnlineStatus, offUserOnlineStatus } = useSocket();
  const { 
    messages: socketMessages, 
    setMessages: setSocketMessages,
    typingUsers, 
    sendChatMessage, 
    handleTyping,
    isConnected: chatConnected 
  } = useChat(chatRoomId);

  // Combine initial messages with real-time messages
  const allMessages = useMemo(() => {
    return [...initialMessages, ...socketMessages];
  }, [initialMessages, socketMessages]);

  // Fetch initial messages - only once
  const fetchInitialMessages = React.useCallback(async () => {
    if (!chatRoomId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chat/messages?chatRoomId=${chatRoomId}`);
      
      if (response.ok) {
        const data = await response.json();
        setInitialMessages(data.messages);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Error fetching initial messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

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

  // Load initial messages when chat room is ready
  useEffect(() => {
    if (chatRoomId) {
      fetchInitialMessages();
    }
  }, [chatRoomId, fetchInitialMessages]);

  // Listen for receiver's online status changes
  useEffect(() => {
    const handleOnlineStatus = (data: any) => {
      if (data.userId === receiverId) {
        setReceiverOnlineStatus(data.isOnline);
      }
    };

    onUserOnlineStatus(handleOnlineStatus);

    return () => {
      offUserOnlineStatus();
    };
  }, [receiverId, onUserOnlineStatus, offUserOnlineStatus]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message using Socket.IO and API
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatRoomId || sending) return;

    try {
      setSending(true);
      
      // Send to API first (for database persistence)
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
        
        // Add to local messages immediately for sender
        setSocketMessages(prev => [...prev, {
          ...data.message,
          timestamp: data.message.timestamp || new Date().toISOString()
        }]);
        
        // Send via Socket.IO for real-time delivery
        if (chatConnected) {
          sendChatMessage(newMessage.trim(), receiverId, currentUserId);
        }
        
        setNewMessage('');
        scrollToBottom();
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

  // Handle typing with Socket.IO
  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Emit typing indicator
    if (chatConnected) {
      handleTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
          {receiverOnlineStatus && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900">{receiverName}</h3>
          <p className="text-sm text-gray-500">
            {receiverOnlineStatus ? 'Online' : 'Offline'}
            {typingUsers.includes(receiverId) && ' • typing...'}
          </p>
        </div>
        
        {/* Connection status indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected && chatConnected ? 'bg-green-500' : 'bg-red-500'
          }`} title={isConnected && chatConnected ? 'Connected' : 'Disconnected'}></div>
          <span className="text-xs text-gray-500">
            {isConnected && chatConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allMessages.map((message) => (
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
        
        {/* Typing indicator */}
        {typingUsers.includes(receiverId) && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTypingInput}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending || !isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !isConnected}
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

export default RealTimeChat;