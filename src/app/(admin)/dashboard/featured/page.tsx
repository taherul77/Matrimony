"use client";

import React, { useState, useEffect } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { 
  FiStar, 
  FiMapPin,
  FiUser,
  FiHeart,
  FiMessageSquare,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiTrendingUp
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface FeaturedProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  profileImage: string;
  isVerified: boolean;
  isPremium: boolean;
  featuredLevel: 'gold' | 'silver' | 'bronze';
  profileViews: number;
  successRate: number;
  lastActive: string;
  bio: string;
}

const FeaturedProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'gold' | 'silver' | 'bronze'>('all');
  const { permissions } = useBusinessLogic();

  useEffect(() => {
    fetchFeaturedProfiles();
  }, []);

  const fetchFeaturedProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/featured');
      
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      } else {
        console.error('Failed to fetch featured profiles');
        setProfiles([]);
      }
    } catch (error) {
      console.error('Error fetching featured profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedBadgeColor = (level: string) => {
    switch (level) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getFeaturedIcon = (level: string) => {
    switch (level) {
      case 'gold':
        return <FaCrown className="w-4 h-4" />;
      case 'silver':
        return <FiStar className="w-4 h-4" />;
      case 'bronze':
        return <FiTrendingUp className="w-4 h-4" />;
      default:
        return <FiStar className="w-4 h-4" />;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    if (filter === 'all') return true;
    return profile.featuredLevel === filter;
  });

  const stats = {
    total: profiles.length,
    gold: profiles.filter(p => p.featuredLevel === 'gold').length,
    silver: profiles.filter(p => p.featuredLevel === 'silver').length,
    bronze: profiles.filter(p => p.featuredLevel === 'bronze').length
  };

  // Check if user has access to featured profiles
  if (!permissions?.isFeatured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border">
          <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Featured Profiles is available for Premium and VIP members. Upgrade your membership to access curated, high-quality profiles.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Featured Profiles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiStar className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Featured Profiles</h1>
              <p className="text-gray-600">Discover handpicked, premium profiles with high success rates</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiStar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaCrown className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gold Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.gold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FiStar className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Silver Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.silver}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bronze Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bronze}</p>
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
                  { key: 'all', label: 'All Featured' },
                  { key: 'gold', label: 'Gold Featured' },
                  { key: 'silver', label: 'Silver Featured' },
                  { key: 'bronze', label: 'Bronze Featured' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === key
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
              onClick={fetchFeaturedProfiles}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Featured Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Featured Badge */}
              <div className="relative">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getFeaturedBadgeColor(profile.featuredLevel)}`}>
                    {getFeaturedIcon(profile.featuredLevel)}
                    <span className="ml-1 capitalize">{profile.featuredLevel} Featured</span>
                  </div>
                </div>
                {profile.isVerified && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </div>
                  </div>
                )}
                {profile.isPremium && (
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <span className="text-gray-500 text-sm">{profile.age} years</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>
                  <div className="text-gray-600 text-sm">
                    <strong>Occupation:</strong> {profile.occupation}
                  </div>
                  <div className="text-gray-600 text-sm">
                    <strong>Education:</strong> {profile.education}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm line-clamp-3">{profile.bio}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiEye className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm font-medium text-gray-600">Views</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{profile.profileViews.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-600">Success</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{profile.successRate}%</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Active {profile.lastActive}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <FiHeart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                      <FiUser className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No featured profiles found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Featured profiles will appear here'
                : `No ${filter} featured profiles available at the moment`
              }
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Browse All Profiles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProfilesPage;
