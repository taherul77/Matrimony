"use client";

import React, { useState, useEffect, useRef } from 'react';
import { generateUniqueKey, safeFormatTime } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead?: boolean;
}

interface ChatProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

const SimpleChatComponent: React.FC<ChatProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  receiverImage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch messages using the simplified messages API
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Start polling for messages
  const startPolling = React.useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000); // Poll every 3 seconds
  }, [fetchMessages]);

  // Initialize and start polling
  useEffect(() => {
    fetchMessages();
    startPolling();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchMessages, startPolling]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch('/api/simple-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: receiverId,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Immediately fetch new messages to show the sent message
        await fetchMessages();
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
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900">{receiverName}</h3>
          <p className="text-sm text-gray-500">Start a conversation</p>
        </div>
        
        {/* Connection status indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500" title="Simple Mode"></div>
          <span className="text-xs text-gray-500">Simple Mode</span>
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

export default SimpleChatComponent;