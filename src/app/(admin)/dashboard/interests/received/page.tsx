"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiHeart, 
  FiMessageSquare, 
  FiClock, 
  FiX,
  FiCheck,
  FiUser,
  FiMapPin,
  FiFilter,
  FiRefreshCw,
  FiEye
} from 'react-icons/fi';

interface Interest {
  id: string;
  senderName: string;
  senderAge: number;
  senderLocation: string;
  senderOccupation: string;
  senderImage: string;
  status: 'pending' | 'accepted' | 'declined';
  receivedDate: string;
  message?: string;
  isVerified: boolean;
  isPremium: boolean;
  matchPercentage: number;
}

const InterestsReceivedPage: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('pending');

  useEffect(() => {
    fetchReceivedInterests();
  }, []);

  const fetchReceivedInterests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/interests?type=received');
      
      if (response.ok) {
        const data = await response.json();
        setInterests(data.interests || []);
      } else {
        console.error('Failed to fetch received interests');
        setInterests([]);
      }
    } catch (error) {
      console.error('Error fetching received interests:', error);
      setInterests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestResponse = async (interestId: string, response: 'accepted' | 'declined') => {
    try {
      // Update local state
      setInterests(prev => 
        prev.map(interest => 
          interest.id === interestId 
            ? { ...interest, status: response }
            : interest
        )
      );
      
      // Here you would make an API call to update the backend
      console.log(`Interest ${interestId} ${response}`);
    } catch (error) {
      console.error('Error responding to interest:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <FiCheck className="w-4 h-4" />;
      case 'declined':
        return <FiX className="w-4 h-4" />;
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const filteredInterests = interests.filter(interest => {
    if (filter === 'all') return true;
    return interest.status === filter;
  });

  const stats = {
    total: interests.length,
    pending: interests.filter(i => i.status === 'pending').length,
    accepted: interests.filter(i => i.status === 'accepted').length,
    declined: interests.filter(i => i.status === 'declined').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Interests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interests Received</h1>
              <p className="text-gray-600">Review and respond to interests from other profiles</p>
            </div>
            {stats.pending > 0 && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                {stats.pending} pending response{stats.pending !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiHeart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiX className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-gray-900">{stats.declined}</p>
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
                  { key: 'pending', label: 'Pending', badge: stats.pending },
                  { key: 'all', label: 'All Interests' },
                  { key: 'accepted', label: 'Accepted' },
                  { key: 'declined', label: 'Declined' }
                ].map(({ key, label, badge }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                    {badge && badge > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={fetchReceivedInterests}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Interests List */}
        <div className="space-y-4">
          {filteredInterests.map((interest) => (
            <div key={interest.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={interest.senderImage}
                    alt={interest.senderName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  {interest.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-green-500 rounded-full p-1">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  {interest.isPremium && (
                    <div className="absolute -bottom-1 -right-1">
                      <div className="bg-yellow-500 rounded-full p-1">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{interest.senderName}</h3>
                        <span className="text-gray-500">{interest.senderAge} years</span>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {interest.matchPercentage}% Match
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {interest.senderLocation}
                      </div>
                      <div className="text-gray-600 text-sm">
                        <strong>Occupation:</strong> {interest.senderOccupation}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interest.status)}`}>
                      {getStatusIcon(interest.status)}
                      <span className="ml-1 capitalize">{interest.status}</span>
                    </div>
                  </div>

                  {/* Message */}
                  {interest.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{interest.message}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Received on {new Date(interest.receivedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      {interest.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleInterestResponse(interest.id, 'declined')}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleInterestResponse(interest.id, 'accepted')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FiCheck className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                        </>
                      )}
                      
                      {interest.status === 'accepted' && (
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <FiMessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </button>
                      )}
                      
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

        {filteredInterests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No interests received yet' : `No ${filter} interests`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Interests from other profiles will appear here'
                : `You don't have any ${filter} interests at the moment`
              }
            </p>
            {filter === 'pending' && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile to Get More Interests
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestsReceivedPage;
