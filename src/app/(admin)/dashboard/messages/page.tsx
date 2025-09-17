"use client";

import React, { useState, useEffect } from 'react';
import OptimizedRealTimeChat from '@/components/OptimizedRealTimeChat';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userImage?: string;
  lastMessage?: string;
  timestamp?: string;
}

const MessagesPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        console.log('Conversations loaded:', data.conversations); // Debug log
        setConversations(data.conversations || []);
      } else {
        console.error('Failed to fetch conversations:', response.status);
        setConversations([]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Failed to load user data</div>
          <button 
            onClick={fetchCurrentUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📨 Admin Messages Dashboard
              </h1>
              <p className="text-gray-600">Monitor and participate in real-time conversations</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              🚀 Real-time Enabled
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Real-time sync active"></div>
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start a conversation by visiting user profiles and clicking "Send Message"</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => setSelectedConversation(conversation.userId)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.userId ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversation.userImage || "/default-avatar.png"}
                        alt={conversation.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.userName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400">
                          {conversation.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messaging Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm h-full">
                <OptimizedRealTimeChat
                  currentUserId={currentUser.id}
                  receiverId={selectedConversation}
                  receiverName={
                    conversations.find(c => c.userId === selectedConversation)?.userName || 'User'
                  }
                  receiverImage={
                    conversations.find(c => c.userId === selectedConversation)?.userImage
                  }
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the left to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
