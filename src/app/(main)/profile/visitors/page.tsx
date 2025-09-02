"use client";

import React, { useState, useEffect } from 'react';
import { FiEye, FiClock, FiUser, FiHeart, FiMessageSquare, FiStar } from 'react-icons/fi';

interface ProfileVisitor {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage?: string;
  visitTime: string;
  viewCount: number;
  isOnline: boolean;
  package: string;
}

const ProfileVisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchProfileVisitors();
  }, [filter]);

  const fetchProfileVisitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile-visits');
      
      if (response.ok) {
        const data = await response.json();
        setVisitors(data.visitors || []);
      } else {
        console.error('Failed to fetch profile visitors');
        setVisitors([]);
      }
    } catch (error) {
      console.error('Error fetching profile visitors:', error);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const getPackageBadge = (packageName: string) => {
    const badges = {
      'VIP': { color: 'bg-red-100 text-red-800', icon: '👑' },
      'Platinum': { color: 'bg-purple-100 text-purple-800', icon: '✨' },
      'Gold': { color: 'bg-yellow-100 text-yellow-800', icon: '⭐' },
      'Silver': { color: 'bg-gray-100 text-gray-800', icon: '🥈' },
      'Free': { color: 'bg-green-100 text-green-800', icon: '🆓' }
    };
    return badges[packageName as keyof typeof badges] || badges.Free;
  };

  const filteredVisitors = visitors.filter(visitor => {
    const now = new Date();
    const visitDate = new Date();
    
    switch (filter) {
      case 'today':
        return visitDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return visitDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return visitDate >= monthAgo;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Profile Visitors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiEye className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Profile Visitors</h1>
          </div>
          <p className="text-lg text-gray-600">
            See who has viewed your profile and connect with interested members
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
                <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
              </div>
              <FiEye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Today's Views</h3>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <FiClock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Premium Visitors</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {visitors.filter(v => ['VIP', 'Platinum', 'Gold'].includes(v.package)).length}
                </p>
              </div>
              <FiStar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Repeat Visitors</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {visitors.filter(v => v.viewCount > 1).length}
                </p>
              </div>
              <FiUser className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Time' },
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Visitors List */}
        <div className="space-y-4">
          {filteredVisitors.map((visitor) => {
            const packageBadge = getPackageBadge(visitor.package);
            return (
              <div key={visitor.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Profile Image */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                          {visitor.name.charAt(0)}
                        </div>
                        {visitor.isOnline && (
                          <div className="absolute bottom-0 right-4 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{visitor.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${packageBadge.color}`}>
                            {packageBadge.icon} {visitor.package}
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm space-y-1">
                          <div className="flex items-center">
                            <FiUser className="w-4 h-4 mr-2" />
                            {visitor.age} years old
                          </div>
                          <div className="flex items-center">
                            <span className="w-4 h-4 mr-2">📍</span>
                            {visitor.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visit Info */}
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        <FiClock className="w-4 h-4 inline mr-1" />
                        {visitor.visitTime}
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        {visitor.viewCount} view{visitor.viewCount > 1 ? 's' : ''}
                      </div>
                      {visitor.viewCount > 1 && (
                        <div className="text-xs text-orange-600 font-medium">
                          🔥 Repeat visitor
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <FiEye className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <FiHeart className="w-4 h-4 mr-2" />
                      Send Interest
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <FiMessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVisitors.length === 0 && (
          <div className="text-center py-12">
            <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "No one has visited your profile yet. Make sure your profile is complete and engaging!"
                : `No visitors found for the selected time period.`
              }
            </p>
          </div>
        )}

        {/* Upgrade CTA for Free Users */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Want More Profile Visibility?</h3>
          <p className="text-lg opacity-90 mb-6">
            Upgrade to Premium to get featured in search results and attract more visitors
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileVisitorsPage;
