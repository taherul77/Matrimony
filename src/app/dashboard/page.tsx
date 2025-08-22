
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiUsers, FiEye, FiClock, FiCheck, FiX } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';

interface Interest {
  id: string;
  status: string;
  message?: string;
  createdAt: string;
  sender?: {
    name: string;
    age: number;
    gender: string;
    profile?: {
      photos: string[];
    };
  };
  receiver?: {
    name: string;
    age: number;
    gender: string;
    profile?: {
      photos: string[];
    };
  };
}

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sentInterests: 0,
    receivedInterests: 0,
    acceptedInterests: 0,
    profileViews: 0,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      // This would fetch user-specific interests and stats
      // For now, we'll show placeholder data
      setStats({
        sentInterests: 5,
        receivedInterests: 12,
        acceptedInterests: 3,
        profileViews: 45,
      });
      
      setInterests([
        // Placeholder data - in real app, fetch from API
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
  <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
 
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-pink-100">Here's what's happening with your matrimonial journey.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <FiHeart className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.profileViews}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiEye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interests Sent</p>
                <p className="text-3xl font-bold text-gray-900">{stats.sentInterests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiHeart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interests Received</p>
                <p className="text-3xl font-bold text-gray-900">{stats.receivedInterests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Connections</p>
                <p className="text-3xl font-bold text-gray-900">{stats.acceptedInterests}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <FiCheck className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Matches</h3>
              <p className="text-gray-600 mb-4">Discover compatible profiles based on your preferences.</p>
              <a
                href="/search"
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Start Searching
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiEye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Profile</h3>
              <p className="text-gray-600 mb-4">Keep your profile fresh and attractive to potential matches.</p>
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiHeart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Matches</h3>
              <p className="text-gray-600 mb-4">Check your mutual interests and connections.</p>
              <a
                href="/matches"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                View Matches
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">Your latest interactions and updates</p>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <FiClock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity to show.</p>
              <p className="text-sm text-gray-400 mt-2">Start browsing profiles to see activity here.</p>
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default UserDashboard;
