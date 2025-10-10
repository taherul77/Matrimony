"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FiHeart, FiUser, FiStar, FiTrendingUp, FiEye, FiMessageSquare, FiMapPin, FiCalendar } from 'react-icons/fi';
import Image from 'next/image';
import { useUser } from '../../../../context/UserContext';

interface CompatibilityMatch {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  photos: string[];
  compatibilityScore: number;
  matchFactors: {
    personality: number;
    interests: number;
    lifestyle: number;
    values: number;
    goals: number;
  };
  sharedInterests: string[];
  profileViews: number;
  lastActive: string;
  isOnline: boolean;
  verified: boolean;
}

interface UserCompatibilityProfile {
  personality: string[];
  interests: string[];
  lifestyle: string[];
  values: string[];
  goals: string[];
}

const DashboardCompatibilityPage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser();
  const [matches, setMatches] = useState<CompatibilityMatch[]>([]);
  const [userProfile, setUserProfile] = useState<UserCompatibilityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<CompatibilityMatch | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const fetchCompatibilityData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch compatibility matches
      const matchesResponse = await fetch('/api/compatibility/matches', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData.matches || []);
      }

      // Fetch user compatibility profile
      const profileResponse = await fetch('/api/compatibility/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData.profile || null);
      }
    } catch (error) {
      console.error('Error fetching compatibility data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!userLoading && user?.id) {
      fetchCompatibilityData();
    }
  }, [userLoading, user?.id, fetchCompatibilityData]);

  const getCompatibilityLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'high') return match.compatibilityScore >= 80;
    if (filter === 'medium') return match.compatibilityScore >= 60 && match.compatibilityScore < 80;
    if (filter === 'low') return match.compatibilityScore < 60;
    return true;
  });

  const handleSendInterest = async (matchId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: matchId,
          message: 'I found our compatibility score interesting and would like to connect!'
        }),
      });

      if (response.ok) {
        alert('Interest sent successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Error sending interest');
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Analyzing compatibility...</div>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to view compatibility matches</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiHeart className="w-8 h-8 mr-3 text-red-500" />
            Compatibility Matches
          </h1>
          <p className="text-gray-600">Discover matches based on deep compatibility analysis</p>
        </div>

        {/* Compatibility Overview */}
        {userProfile && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Compatibility Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Personality</div>
                <div className="text-sm text-gray-600">{userProfile.personality.length} traits</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FiStar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Interests</div>
                <div className="text-sm text-gray-600">{userProfile.interests.length} interests</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Lifestyle</div>
                <div className="text-sm text-gray-600">{userProfile.lifestyle.length} factors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <FiHeart className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Values</div>
                <div className="text-sm text-gray-600">{userProfile.values.length} values</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <FiCalendar className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">Goals</div>
                <div className="text-sm text-gray-600">{userProfile.goals.length} goals</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Matches', count: matches.length },
            { key: 'high', label: 'High (80%+)', count: matches.filter(m => m.compatibilityScore >= 80).length },
            { key: 'medium', label: 'Good (60-79%)', count: matches.filter(m => m.compatibilityScore >= 60 && m.compatibilityScore < 80).length },
            { key: 'low', label: 'Fair (<60%)', count: matches.filter(m => m.compatibilityScore < 60).length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'No compatibility matches available at the moment.' 
                : `No matches found for ${filter} compatibility level.`
              }
            </p>
            <button 
              onClick={() => setFilter('all')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View All Matches
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => {
              const compatibility = getCompatibilityLevel(match.compatibilityScore);
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Profile Image */}
                  <div className="relative h-48">
                    <Image
                      src={match.photos[0] || '/placeholder-avatar.jpg'}
                      alt={`${match.firstName} ${match.lastName}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${compatibility.bgColor} ${compatibility.color}`}>
                        {match.compatibilityScore}% {compatibility.level}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {match.isOnline && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Online
                        </span>
                      )}
                      {match.verified && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {match.firstName} {match.lastName}
                        </h3>
                        <p className="text-gray-600">{match.age} years old</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-500">{match.compatibilityScore}%</div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiUser className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.profession}</span>
                      </div>
                    </div>

                    {/* Compatibility Breakdown */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Compatibility Factors</div>
                      <div className="space-y-1">
                        {Object.entries(match.matchFactors).map(([factor, score]) => (
                          <div key={factor} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 capitalize">{factor}</span>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
                                <div
                                  className="bg-blue-500 h-1 rounded-full"
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shared Interests */}
                    {match.sharedInterests.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Shared Interests</div>
                        <div className="flex flex-wrap gap-1">
                          {match.sharedInterests.slice(0, 3).map((interest, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                          {match.sharedInterests.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              +{match.sharedInterests.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <FiEye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleSendInterest(match.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <FiHeart className="w-4 h-4 mr-2" />
                        Interest
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Profile Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Compatibility Analysis
                  </h2>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profile Info */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={selectedMatch.photos[0] || '/placeholder-avatar.jpg'}
                          alt={`${selectedMatch.firstName} ${selectedMatch.lastName}`}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {selectedMatch.firstName} {selectedMatch.lastName}
                        </h3>
                        <p className="text-gray-600">{selectedMatch.age} years old • {selectedMatch.location}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Profession</div>
                        <div className="text-gray-900">{selectedMatch.profession}</div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">All Shared Interests</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMatch.sharedInterests.map((interest, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Breakdown */}
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-red-500 mb-2">
                        {selectedMatch.compatibilityScore}%
                      </div>
                      <div className="text-lg text-gray-700">
                        {getCompatibilityLevel(selectedMatch.compatibilityScore).level} Compatibility
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedMatch.matchFactors).map(([factor, score]) => (
                        <div key={factor}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">{factor}</span>
                            <span className="text-sm text-gray-600">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                score >= 80 ? 'bg-green-500' :
                                score >= 60 ? 'bg-blue-500' :
                                score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleSendInterest(selectedMatch.id)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <FiHeart className="w-5 h-5 mr-2" />
                    Send Interest
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <FiMessageSquare className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCompatibilityPage;
