'use client';

import React, { useState, useEffect } from 'react';
import OptimizedRealTimeChat from '@/components/OptimizedRealTimeChat';

type SimpleUser = { id: string; name: string; email?: string };

export default function RealtimeMessagingTest() {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [currentUser, setCurrentUser] = useState<SimpleUser | null>(null);
  const [receiver, setReceiver] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to load users');
        const data = await res.json();
        const list: SimpleUser[] = data.users || [];
        setUsers(list);
        if (list.length >= 2) {
          setCurrentUser(list[0]);
          setReceiver(list[1]);
        } else if (list.length === 1) {
          setCurrentUser(list[0]);
          setReceiver(list[0]);
        }
      } catch (e: any) {
        setError(e?.message || 'Error loading users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const swapUsers = () => {
    if (currentUser && receiver) {
      setCurrentUser(receiver);
      setReceiver(currentUser);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!currentUser || !receiver) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
        Not enough users in DB. Please seed at least 2 users.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🚀 Real-time Messaging Test</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800">Participants</h3>
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-xs text-blue-700">Current User</div>
                  <div className="font-medium text-blue-900">{currentUser.name}</div>
                  <div className="text-[11px] text-blue-700 break-all">ID: {currentUser.id}</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-xs text-green-700">Receiver</div>
                  <div className="font-medium text-green-900">{receiver.name}</div>
                  <div className="text-[11px] text-green-700 break-all">ID: {receiver.id}</div>
                </div>
              </div>
              <button
                onClick={swapUsers}
                className="mt-3 px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Swap Users
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Notes</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Uses real user IDs from your database</li>
                <li>Messages appear instantly via Socket.IO when connected</li>
                <li>Falls back to polling every 3s only if Socket.IO fails</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-lg font-semibold">Chat with {receiver.name}</h2>
            <p className="text-blue-100 text-sm">Open this page in two tabs and send messages.</p>
          </div>

          <div className="h-96">
            <OptimizedRealTimeChat
              currentUserId={currentUser.id}
              receiverId={receiver.id}
              receiverName={receiver.name}
              receiverImage={'/vercel.svg'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}