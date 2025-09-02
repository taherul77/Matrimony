"use client";

import React, { useState, useEffect } from 'react';
import { ProfileCard } from '@/components';
import { FiHeart, FiUsers, FiStar } from 'react-icons/fi';

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  photos: string[];
  bio: string;
  matchPercentage: number;
  isOnline: boolean;
  lastSeen: string;
}

const DashboardMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
          fetchMatches(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchMatches = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      } else {
        console.error('Failed to fetch matches');
        setMatches([]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to view your matches</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Finding your matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Matches</h1>
          <p className="text-gray-600">Compatible profiles based on your preferences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiHeart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Online Now</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.filter(match => match.isOnline).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">High Compatibility</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.filter(match => match.matchPercentage >= 80).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={match.photos[0] || '/default-avatar.png'}
                    alt={match.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      {match.matchPercentage}% Match
                    </span>
                  </div>
                  {match.isOnline && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Online
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{match.name}</h3>
                  <p className="text-gray-600 mb-2">{match.age} years • {match.location}</p>
                  <p className="text-gray-600 mb-2">{match.occupation}</p>
                  <p className="text-gray-600 mb-4">{match.education}</p>
                  
                  {match.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{match.bio}</p>
                  )}
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Send Interest
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    {match.isOnline ? 'Online now' : `Last seen ${match.lastSeen}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6">
              We're still looking for your perfect match. Complete your profile to get better matches.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Complete Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMatchesPage;
