"use client";
import React, { useState, useEffect } from 'react';
import { FiSend, FiLock, FiMessageCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface MessagingComponentProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName: string;
  currentUserPackage?: string;
}

const MessagingComponent: React.FC<MessagingComponentProps> = ({ 
  currentUserId, 
  targetUserId, 
  targetUserName,
  currentUserPackage = 'Free'
}) => {
  const { permissions, usage, checkAction } = useBusinessLogic(currentUserId);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const handleSendMessage = async () => {
    if (!permissions || !usage || !message.trim()) return;

    // Check messaging permission
    const canMessage = await checkAction('send_message');
    if (!canMessage.allowed) {
      alert(canMessage.message || 'Messaging not available');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          content: message
        }),
      });

      if (response.ok) {
        setMessage('');
        // Refresh messages or add to local state
        alert('Message sent successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!permissions || !usage) {
    return <div className="animate-pulse bg-gray-200 h-40 rounded"></div>;
  }

  // Free Package - No direct messaging
  if (!permissions.canMessage) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <FiLock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-800 mb-2">
            Direct Messaging Not Available
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Free users can only receive messages from Premium members
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">What you can do:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Send interests to show your interest</li>
              <li>• Receive messages from Silver+ members</li>
              <li>• Browse and search profiles</li>
            </ul>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/packages'}
              className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Upgrade to Silver - Start Messaging
            </button>
            <p className="text-xs text-gray-500">
              Silver: 10 messages/month • Gold: Unlimited messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { messages: messageUsage } = usage;

  return (
    <div className="space-y-4">
      {/* Package Status */}
      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
        <div className="flex items-center">
          <FiMessageCircle className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-gray-800">Messages</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">
            {messageUsage.current}/{messageUsage.limit === -1 ? '∞' : messageUsage.limit}
          </div>
          <div className="text-xs text-gray-500">
            {messageUsage.limit === -1 ? 'Unlimited' : 'this month'}
          </div>
        </div>
      </div>

      {/* Package-specific messaging info */}
      {messageUsage.limit === 10 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <HiSparkles className="w-4 h-4 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Silver Package</p>
              <p className="text-xs text-blue-600">
                10 messages per month • {messageUsage.limit - messageUsage.current} remaining
              </p>
            </div>
          </div>
          {messageUsage.current >= messageUsage.limit - 2 && (
            <div className="mt-2">
              <p className="text-xs text-blue-700">
                Running low on messages? Upgrade to Gold for unlimited messaging
              </p>
            </div>
          )}
        </div>
      )}

      {messageUsage.limit === -1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <HiSparkles className="w-4 h-4 text-green-600 mr-2" />
            <p className="text-sm font-medium text-green-800">
              Unlimited Messaging • Gold+ Package
            </p>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send a message to ${targetUserName}...`}
          disabled={!messageUsage.allowed}
          className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
            !messageUsage.allowed ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          rows={3}
        />

        {/* Send Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {!messageUsage.allowed ? 'Monthly limit reached' : `${message.length}/500 characters`}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageUsage.allowed || !message.trim() || sending}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              messageUsage.allowed && message.trim() && !sending
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiSend className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {/* Upgrade prompt for limit reached */}
        {!messageUsage.allowed && messageUsage.limit !== -1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-medium text-yellow-800">Monthly message limit reached!</p>
            <p className="text-xs text-yellow-600 mb-2">
              Upgrade to Gold package for unlimited messaging
            </p>
            <button 
              onClick={() => window.location.href = '/packages'}
              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingComponent;
