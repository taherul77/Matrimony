"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiHeart, 
  FiDollarSign, 
  FiActivity,
  FiCalendar,
  FiPackage,
  FiMessageSquare
} from 'react-icons/fi';

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  successfulMatches: number;
  revenue: number;
  monthlyRevenue: number;
  packageDistribution: any[];
  userGrowth: any[];
  matchingStats: any[];
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockAnalytics: Analytics = {
        totalUsers: 15420,
        activeUsers: 8743,
        totalMatches: 3245,
        successfulMatches: 987,
        revenue: 2847500,
        monthlyRevenue: 485000,
        packageDistribution: [
          { name: 'Free', users: 8420, percentage: 54.6 },
          { name: 'Silver', users: 3240, percentage: 21.0 },
          { name: 'Gold', users: 2150, percentage: 13.9 },
          { name: 'Platinum', users: 1210, percentage: 7.8 },
          { name: 'VIP', users: 400, percentage: 2.6 }
        ],
        userGrowth: [
          { month: 'Jan', users: 12500 },
          { month: 'Feb', users: 13200 },
          { month: 'Mar', users: 13800 },
          { month: 'Apr', users: 14100 },
          { month: 'May', users: 14650 },
          { month: 'Jun', users: 15420 }
        ],
        matchingStats: [
          { type: 'Profile Views', count: 89650 },
          { type: 'Interests Sent', count: 12450 },
          { type: 'Messages Exchanged', count: 45230 },
          { type: 'Successful Matches', count: 987 }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiTrendingUp className="w-8 h-8 mr-3" />
                Business Analytics
              </h1>
              <p className="text-gray-600 mt-2">Platform performance and business metrics</p>
            </div>
            <div className="flex space-x-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+8.3% from last month</p>
              </div>
              <FiActivity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Successful Matches</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.successfulMatches}</p>
                <p className="text-sm text-green-600">+15.2% from last month</p>
              </div>
              <FiHeart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.monthlyRevenue)}</p>
                <p className="text-sm text-green-600">+22.1% from last month</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="space-y-4">
              {analytics.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{data.month}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(data.users / 16000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{data.users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Distribution</h3>
            <div className="space-y-4">
              {analytics.packageDistribution.map((pkg, index) => (
                <div key={`package-dist-${index}-${pkg.name}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiPackage className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">{pkg.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${pkg.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-sm w-16 text-right">
                      {pkg.users.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analytics.matchingStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  {stat.type === 'Profile Views' && <FiUsers className="w-6 h-6 text-blue-600" />}
                  {stat.type === 'Interests Sent' && <FiHeart className="w-6 h-6 text-red-600" />}
                  {stat.type === 'Messages Exchanged' && <FiMessageSquare className="w-6 h-6 text-green-600" />}
                  {stat.type === 'Successful Matches' && <FiActivity className="w-6 h-6 text-purple-600" />}
                </div>
                <h4 className="font-semibold text-gray-900">{stat.count.toLocaleString()}</h4>
                <p className="text-sm text-gray-600">{stat.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Package</h3>
            <div className="space-y-4">
              {analytics.packageDistribution.filter(pkg => pkg.name !== 'Free').map((pkg, index) => {
                const revenue = pkg.users * (pkg.name === 'VIP' ? 5000 : pkg.name === 'Platinum' ? 2500 : pkg.name === 'Gold' ? 1500 : 500);
                return (
                  <div key={`revenue-${index}-${pkg.name}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{pkg.name} Package</h4>
                      <p className="text-sm text-gray-600">{pkg.users.toLocaleString()} subscribers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(revenue)}</p>
                      <p className="text-sm text-gray-600">Monthly</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Schedule Report
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
