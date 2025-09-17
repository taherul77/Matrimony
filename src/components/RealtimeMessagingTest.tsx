import React, { useState } from 'react';
import BasicChatComponent from './BasicChatComponent';
import { useUser } from '@/context/UserContext';

// Test component for messaging system
const RealtimeMessagingTest: React.FC = () => {
  const { user, isLoggedIn } = useUser();
  const [testReceiverId, setTestReceiverId] = useState('test-user-2');
  const [testReceiverName, setTestReceiverName] = useState('Test User 2');

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-yellow-700">
            Please log in to test the messaging system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Messaging System Test
        </h1>
        
        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Current User</h3>
          <div className="text-gray-600">
            <span className="font-medium">Name:</span> {user.name} <br />
            <span className="font-medium">ID:</span> {user.id}
          </div>
        </div>

        {/* Test Configuration */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Test Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Receiver ID
              </label>
              <input
                type="text"
                value={testReceiverId}
                onChange={(e) => setTestReceiverId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter receiver user ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Receiver Name
              </label>
              <input
                type="text"
                value={testReceiverName}
                onChange={(e) => setTestReceiverName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter receiver name"
              />
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">How to Test</h3>
          <ol className="list-decimal list-inside space-y-1 text-green-800">
            <li>The chat system automatically polls for new messages every 3 seconds</li>
            <li>Send messages and they will appear in both windows</li>
            <li>Use the refresh button to manually check for new messages</li>
            <li>Open multiple windows to test messaging between users</li>
            <li>Messages are persisted in the database</li>
          </ol>
        </div>

        {/* Chat Component */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Basic Chat System</h3>
          </div>
          <div className="p-4">
            <BasicChatComponent
              currentUserId={user.id}
              receiverId={testReceiverId}
              receiverName={testReceiverName}
              receiverImage="/default-avatar.png"
              isOnline={false}
            />
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Mode:</strong> Basic Polling (every 3 seconds)
            </div>
            <div>
              <strong>Features:</strong> Send/Receive Messages, Auto-refresh
            </div>
            <div>
              <strong>Current User:</strong> {user.name} ({user.id})
            </div>
            <div>
              <strong>Target User:</strong> {testReceiverName} ({testReceiverId})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMessagingTest;