
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiHeart, 
  FiMessageSquare, 
  FiEye,
  FiTrendingUp,
  FiDollarSign,
  FiShield,
  FiStar,
  FiActivity
} from 'react-icons/fi';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  messagesExchanged: number;
  profileViews: number;
  successStories: number;
  revenue: number;
  premiumUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    messagesExchanged: 0,
    profileViews: 0,
    successStories: 0,
    revenue: 0,
    premiumUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockStats: DashboardStats = {
        totalUsers: 125000,
        activeUsers: 45000,
        totalMatches: 85000,
        messagesExchanged: 2500000,
        profileViews: 15000000,
        successStories: 12500,
        revenue: 2500000,
        premiumUsers: 15000
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <FiTrendingUp className="inline w-3 h-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview and key metrics for your matrimonial platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FiUsers}
            color="bg-blue-500"
            change="+12% from last month"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={FiActivity}
            color="bg-green-500"
            change="+8% from last month"
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            icon={FiHeart}
            color="bg-red-500"
            change="+15% from last month"
          />
          <StatCard
            title="Messages Exchanged"
            value={stats.messagesExchanged}
            icon={FiMessageSquare}
            color="bg-purple-500"
            change="+22% from last month"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Profile Views"
            value={stats.profileViews}
            icon={FiEye}
            color="bg-indigo-500"
            change="+18% from last month"
          />
          <StatCard
            title="Success Stories"
            value={stats.successStories}
            icon={FiStar}
            color="bg-yellow-500"
            change="+5% from last month"
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={FiDollarSign}
            color="bg-emerald-500"
            change="+25% from last month"
          />
          <StatCard
            title="Premium Users"
            value={stats.premiumUsers}
            icon={FiShield}
            color="bg-orange-500"
            change="+20% from last month"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New User #{i}</p>
                    <p className="text-xs text-gray-500">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiHeart className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Match Created</p>
                    <p className="text-xs text-gray-500">{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
              <FiUsers className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
              <FiShield className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Verification Queue</h4>
              <p className="text-sm text-gray-600">Review pending verifications</p>
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
              <FiMessageSquare className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-medium text-gray-900">Support Tickets</h4>
              <p className="text-sm text-gray-600">Handle customer support</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
