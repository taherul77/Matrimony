"use client";

import React, { useState, useEffect } from 'react';
import { FiEye, FiMessageSquare, FiShield, FiHeart, FiSearch, FiUsers, FiTrendingUp, FiStar } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  subscription?: {
    package: string;
    status: string;
    expiresAt: string;
  };
}

const DashboardVipPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [vipStats, setVipStats] = useState({
    profileViews: 0,
    superLikes: 0,
    premiumMatches: 0,
    exclusiveFeatures: 0
  });

  useEffect(() => {
    const fetchUserAndVipData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await fetch('/api/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.user);
          
          // Fetch VIP stats if user is VIP
          if (userData.user.subscription?.package === 'VIP') {
            const statsResponse = await fetch('/api/vip-stats');
            if (statsResponse.ok) {
              const stats = await statsResponse.json();
              setVipStats(stats);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching VIP data:', error);
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
          fetchUserAndVipData();
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to access VIP features</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading VIP features...</div>
        </div>
      </div>
    );
  }

  const isVipMember = currentUser?.subscription?.package === 'VIP';

  const vipFeatures = [
    {
      icon: FiEye,
      title: 'Advanced Profile Views',
      description: 'See who viewed your profile and when',
      available: isVipMember,
      color: 'text-blue-500'
    },
    {
      icon: FiMessageSquare,
      title: 'Priority Messaging',
      description: 'Your messages appear at the top of inboxes',
      available: isVipMember,
      color: 'text-green-500'
    },
    {
      icon: FiShield,
      title: 'Enhanced Privacy',
      description: 'Advanced privacy controls and invisible browsing',
      available: isVipMember,
      color: 'text-purple-500'
    },
    {
      icon: FiHeart,
      title: 'Unlimited Likes',
      description: 'Express interest in unlimited profiles',
      available: isVipMember,
      color: 'text-red-500'
    },
    {
      icon: FiSearch,
      title: 'Advanced Search',
      description: 'Search by education, profession, and more',
      available: isVipMember,
      color: 'text-indigo-500'
    },
    {
      icon: FiUsers,
      title: 'VIP Only Matches',
      description: 'Connect exclusively with other VIP members',
      available: isVipMember,
      color: 'text-pink-500'
    },
    {
      icon: FiTrendingUp,
      title: 'Profile Boost',
      description: 'Get 10x more profile visibility',
      available: isVipMember,
      color: 'text-orange-500'
    },
    {
      icon: FiStar,
      title: 'Verified Badge',
      description: 'Show your authenticity with a verified badge',
      available: isVipMember,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaCrown className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">VIP Features</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {isVipMember 
              ? 'Welcome to your exclusive VIP experience!' 
              : 'Unlock premium features with VIP membership'
            }
          </p>
        </div>

        {isVipMember ? (
          <>
            {/* VIP Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profile Views</p>
                    <p className="text-3xl font-bold text-blue-600">{vipStats.profileViews}</p>
                  </div>
                  <FiEye className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Super Likes</p>
                    <p className="text-3xl font-bold text-red-600">{vipStats.superLikes}</p>
                  </div>
                  <FiHeart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Premium Matches</p>
                    <p className="text-3xl font-bold text-green-600">{vipStats.premiumMatches}</p>
                  </div>
                  <FiUsers className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Exclusive Features</p>
                    <p className="text-3xl font-bold text-yellow-600">{vipStats.exclusiveFeatures}</p>
                  </div>
                  <FaCrown className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* VIP Member Benefits */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center mb-4">
                <FaCrown className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-bold">Your VIP Benefits</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FiEye className="w-5 h-5 mr-2" />
                  <span>See who viewed your profile</span>
                </div>
                <div className="flex items-center">
                  <FiMessageSquare className="w-5 h-5 mr-2" />
                  <span>Priority message placement</span>
                </div>
                <div className="flex items-center">
                  <FiShield className="w-5 h-5 mr-2" />
                  <span>Enhanced privacy controls</span>
                </div>
                <div className="flex items-center">
                  <FiHeart className="w-5 h-5 mr-2" />
                  <span>Unlimited likes</span>
                </div>
                <div className="flex items-center">
                  <FiSearch className="w-5 h-5 mr-2" />
                  <span>Advanced search filters</span>
                </div>
                <div className="flex items-center">
                  <FiTrendingUp className="w-5 h-5 mr-2" />
                  <span>Profile boost included</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Upgrade to VIP Section */
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
            <FaCrown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to VIP</h2>
            <p className="text-gray-600 mb-6">
              Join our exclusive VIP community and unlock premium features designed to help you find your perfect match faster.
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Special Offer</h3>
              <p className="text-3xl font-bold">$99/month</p>
              <p className="text-sm opacity-90">First month 50% off</p>
            </div>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-200">
              Upgrade to VIP Now
            </button>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vipFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all duration-200 ${
                  feature.available 
                    ? 'border-yellow-300 shadow-yellow-100' 
                    : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-center mb-4">
                  <IconComponent className={`w-8 h-8 mr-3 ${feature.color}`} />
                  {feature.available && <FaCrown className="w-4 h-4 text-yellow-500" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className={`text-sm font-medium ${
                  feature.available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {feature.available ? '✓ Available' : 'VIP Required'}
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Support */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCrown className="w-6 h-6 text-yellow-500 mr-2" />
            VIP Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600 mb-4">
                As a VIP member, you get priority customer support with dedicated agents.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Contact VIP Support
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Success Manager</h3>
              <p className="text-gray-600 mb-4">
                Work with your personal success manager to optimize your profile and matching.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>

        {isVipMember && (
          /* VIP Member Actions */
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Quick VIP Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <FiTrendingUp className="w-6 h-6 mb-2" />
                <div className="font-medium">Boost Profile</div>
                <div className="text-sm opacity-90">Get 10x visibility</div>
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <FiSearch className="w-6 h-6 mb-2" />
                <div className="font-medium">Advanced Search</div>
                <div className="text-sm opacity-90">Find specific matches</div>
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <FiUsers className="w-6 h-6 mb-2" />
                <div className="font-medium">VIP Matches</div>
                <div className="text-sm opacity-90">Exclusive connections</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardVipPage;
