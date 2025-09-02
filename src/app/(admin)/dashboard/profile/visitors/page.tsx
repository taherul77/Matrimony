"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiEye, 
  FiMapPin,
  FiUser,
  FiClock,
  FiTrendingUp,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiHeart
} from 'react-icons/fi';

interface ProfileVisitor {
  id: string;
  visitorName: string;
  visitorAge: number;
  visitorLocation: string;
  visitorOccupation: string;
  visitorImage: string;
  visitDate: string;
  visitTime: string;
  isVerified: boolean;
  isPremium: boolean;
  matchPercentage: number;
  profileCompleteness: number;
}

const ProfileVisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');

  useEffect(() => {
    fetchProfileVisitors();
  }, []);

  const fetchProfileVisitors = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockVisitors: ProfileVisitor[] = [
        {
          id: '1',
          visitorName: 'Rajesh Kumar',
          visitorAge: 29,
          visitorLocation: 'Bangalore, Karnataka',
          visitorOccupation: 'Software Engineer',
          visitorImage: '/uploads/1755858552715_user2.jpg',
          visitDate: '2025-09-02',
          visitTime: '14:30',
          isVerified: true,
          isPremium: true,
          matchPercentage: 92,
          profileCompleteness: 95
        },
        {
          id: '2',
          visitorName: 'Amit Sharma',
          visitorAge: 27,
          visitorLocation: 'Mumbai, Maharashtra',
          visitorOccupation: 'Doctor',
          visitorImage: '/uploads/1755863927941_user2.jpg',
          visitDate: '2025-09-02',
          visitTime: '11:15',
          isVerified: true,
          isPremium: false,
          matchPercentage: 88,
          profileCompleteness: 87
        },
        {
          id: '3',
          visitorName: 'Vikash Patel',
          visitorAge: 31,
          visitorLocation: 'Delhi, India',
          visitorOccupation: 'Business Owner',
          visitorImage: '/uploads/1756105297051_user2.jpg',
          visitDate: '2025-09-01',
          visitTime: '16:45',
          isVerified: false,
          isPremium: false,
          matchPercentage: 76,
          profileCompleteness: 78
        },
        {
          id: '4',
          visitorName: 'Suresh Gupta',
          visitorAge: 33,
          visitorLocation: 'Chennai, Tamil Nadu',
          visitorOccupation: 'Engineer',
          visitorImage: '/uploads/1755858552715_user2.jpg',
          visitDate: '2025-08-31',
          visitTime: '09:20',
          isVerified: true,
          isPremium: true,
          matchPercentage: 82,
          profileCompleteness: 91
        },
        {
          id: '5',
          visitorName: 'Arjun Singh',
          visitorAge: 26,
          visitorLocation: 'Pune, Maharashtra',
          visitorOccupation: 'Marketing Manager',
          visitorImage: '/uploads/1755863927941_user2.jpg',
          visitDate: '2025-08-30',
          visitTime: '19:30',
          isVerified: true,
          isPremium: false,
          matchPercentage: 74,
          profileCompleteness: 83
        }
      ];
      setVisitors(mockVisitors);
    } catch (error) {
      console.error('Error fetching profile visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredVisitors = () => {
    const now = new Date();
    return visitors.filter(visitor => {
      const visitDate = new Date(visitor.visitDate);
      
      switch (timeFilter) {
        case 'today':
          return visitDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return visitDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return visitDate >= monthAgo;
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredVisitors = getFilteredVisitors();

  const stats = {
    total: visitors.length,
    today: visitors.filter(v => new Date(v.visitDate).toDateString() === new Date().toDateString()).length,
    thisWeek: visitors.filter(v => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(v.visitDate) >= weekAgo;
    }).length,
    premium: visitors.filter(v => v.isPremium).length
  };

  const formatVisitTime = (date: string, time: string) => {
    const visitDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = now.getTime() - visitDateTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Profile Visitors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Visitors</h1>
          <p className="text-gray-600">See who's been checking out your profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiEye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiUser className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.premium}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                  { key: 'all', label: 'All Time' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeFilter(key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeFilter === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={fetchProfileVisitors}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Visitors List */}
        <div className="space-y-4">
          {filteredVisitors.map((visitor) => (
            <div key={visitor.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={visitor.visitorImage}
                    alt={visitor.visitorName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  {visitor.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-green-500 rounded-full p-1">
                        <FiUser className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  {visitor.isPremium && (
                    <div className="absolute -bottom-1 -right-1">
                      <div className="bg-yellow-500 rounded-full p-1">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visitor Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{visitor.visitorName}</h3>
                        <span className="text-gray-500">{visitor.visitorAge} years</span>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {visitor.matchPercentage}% Match
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {visitor.visitorLocation}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <strong>Occupation:</strong> {visitor.visitorOccupation}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <strong>Profile Completeness:</strong> {visitor.profileCompleteness}%
                      </div>
                    </div>
                    
                    {/* Visit Time */}
                    <div className="text-right">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="w-4 h-4 mr-1" />
                        {formatVisitTime(visitor.visitDate, visitor.visitTime)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(visitor.visitDate).toLocaleDateString()} at {visitor.visitTime}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {visitor.isVerified && (
                        <span className="flex items-center">
                          <FiUser className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                      {visitor.isPremium && (
                        <span className="flex items-center text-yellow-600">
                          <FiUser className="w-3 h-3 mr-1" />
                          Premium Member
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiHeart className="w-4 h-4 mr-2" />
                        Show Interest
                      </button>
                      <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiEye className="w-4 h-4 mr-2" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVisitors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No visitors {timeFilter !== 'all' ? `in the selected time period` : 'yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {timeFilter === 'all' 
                ? 'Profile visitors will appear here when someone views your profile'
                : 'Try selecting a different time period or check back later'
              }
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Profile Visibility
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileVisitorsPage;
