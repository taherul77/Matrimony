"use client";

import React, { useState, useEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { FiHeart, FiX, FiEye, FiMessageSquare, FiStar, FiMapPin, FiCalendar, FiBookOpen, FiBriefcase } from 'react-icons/fi';
import Image from 'next/image';

interface HandpickedMatch {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  photos: string[];
  compatibility: number;
  profileViews: number;
  lastActive: string;
  isOnline: boolean;
  interests: string[];
  bio: string;
  verified: boolean;
  matchReason: string;
}

const DashboardHandpickedMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<HandpickedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<HandpickedMatch | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandpickedMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vip/handpicked-matches');
        
        if (response.ok) {
          const data = await response.json();
          setMatches(data.matches || []);
        } else {
          console.error('Failed to fetch handpicked matches');
        }
      } catch (error) {
        console.error('Error fetching handpicked matches:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
          fetchHandpickedMatches();
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const handleInterest = async (matchId: string, action: 'like' | 'pass') => {
    if (!currentUserId) return;

    try {
      setActionLoading(matchId);
      const response = await fetch('/api/vip/handpicked-matches/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          action,
          userId: currentUserId
        }),
      });

      if (response.ok) {
        // Remove the match from the list after action
        setMatches(prev => prev.filter(match => match.id !== matchId));
        setSelectedMatch(null);
        
        if (action === 'like') {
          alert('Interest sent! We\'ll notify you if they\'re interested too.');
        }
      } else {
        alert(`Failed to ${action} profile`);
      }
    } catch (error) {
      console.error(`Error ${action}ing profile:`, error);
      alert(`Error ${action}ing profile`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = (match: HandpickedMatch) => {
    setSelectedMatch(match);
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to view handpicked matches</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Finding your perfect matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaCrown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Handpicked Matches</h1>
          </div>
          <p className="text-center text-gray-600">
            Carefully curated matches based on your preferences and compatibility
          </p>
          <div className="text-center mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <FaCrown className="w-4 h-4 mr-1" />
              VIP Exclusive Feature
            </span>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <FaCrown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No New Handpicked Matches</h2>
            <p className="text-gray-600 mb-6">
              Our experts are working on finding your perfect matches. Check back soon!
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700">
              Expand Search Criteria
            </button>
          </div>
        ) : (
          <>
            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-yellow-200"
                >
                  {/* Profile Image */}
                  <div className="relative h-64">
                    <Image
                      src={match.photos[0] || '/placeholder-avatar.jpg'}
                      alt={`${match.firstName} ${match.lastName}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <FaCrown className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {match.isOnline && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Online
                        </span>
                      )}
                      {match.verified && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <FiStar className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3 text-white">
                        <h3 className="text-lg font-semibold">
                          {match.firstName} {match.lastName}
                        </h3>
                        <p className="text-sm opacity-90">{match.age} years old</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiBriefcase className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.profession}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiBookOpen className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.education}</span>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Compatibility</span>
                        <span className="text-sm font-bold text-green-600">{match.compatibility}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${match.compatibility}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Match Reason */}
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-xs font-medium text-yellow-800 mb-1">Why this match?</div>
                      <div className="text-sm text-yellow-700">{match.matchReason}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewProfile(match)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <FiEye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleInterest(match.id, 'pass')}
                        disabled={actionLoading === match.id}
                        className="bg-gray-200 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleInterest(match.id, 'like')}
                        disabled={actionLoading === match.id}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-50"
                      >
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VIP Benefits */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaCrown className="w-6 h-6 mr-2" />
                VIP Handpicked Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FiStar className="w-5 h-5 mr-2" />
                  <span>Expert curation by relationship specialists</span>
                </div>
                <div className="flex items-center">
                  <FiHeart className="w-5 h-5 mr-2" />
                  <span>Higher compatibility scores</span>
                </div>
                <div className="flex items-center">
                  <FiEye className="w-5 h-5 mr-2" />
                  <span>Detailed match analysis</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Profile Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaCrown className="w-6 h-6 text-yellow-500 mr-2" />
                    {selectedMatch.firstName} {selectedMatch.lastName}
                  </h2>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Profile Content */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Age</div>
                      <div className="text-lg text-gray-900">{selectedMatch.age} years</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Location</div>
                      <div className="text-lg text-gray-900">{selectedMatch.location}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Profession</div>
                      <div className="text-lg text-gray-900">{selectedMatch.profession}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Education</div>
                      <div className="text-lg text-gray-900">{selectedMatch.education}</div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">About</div>
                    <div className="text-gray-900">{selectedMatch.bio}</div>
                  </div>

                  {/* Interests */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compatibility */}
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Compatibility Score</div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                          style={{ width: `${selectedMatch.compatibility}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-green-600">{selectedMatch.compatibility}%</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleInterest(selectedMatch.id, 'pass')}
                      disabled={actionLoading === selectedMatch.id}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => handleInterest(selectedMatch.id, 'like')}
                      disabled={actionLoading === selectedMatch.id}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      <FiHeart className="w-5 h-5 mr-2" />
                      Send Interest
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <FiMessageSquare className="w-5 h-5 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHandpickedMatchesPage;
