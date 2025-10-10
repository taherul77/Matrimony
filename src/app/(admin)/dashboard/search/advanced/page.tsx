"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter,
  FiStar,
  FiMapPin,
  FiBookOpen,
  FiHeart,
  FiMessageSquare,
  FiSettings,
  FiTrendingUp
} from 'react-icons/fi';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';
import { useLocalStorage } from '@/hooks/useClientOnly';
import { useMemo } from 'react';

interface AdvancedFilters {
  ageRange: [number, number];
  heightRange: [number, number];
  location: string;
  education: string[];
  occupation: string[];
  religion: string[];
  motherTongue: string[];
  maritalStatus: string[];
  income: {
    min: number;
    max: number;
  };
  lifestyle: {
    smoking: string;
    drinking: string;
    diet: string;
  };
  family: {
    type: string;
    status: string;
    values: string;
  };
  horoscope: {
    required: boolean;
    manglik: string;
  };
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  religion: string;
  height: string;
  profileImage: string;
  verified: boolean;
  premium: boolean;
  matchPercentage: number;
  lastActive: string;
}

const AdvancedSearchPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdvancedFilters>({
    ageRange: [22, 35],
    heightRange: [150, 180],
    location: '',
    education: [],
    occupation: [],
    religion: [],
    motherTongue: [],
    maritalStatus: [],
    income: {
      min: 0,
      max: 2000000
    },
    lifestyle: {
      smoking: '',
      drinking: '',
      diet: ''
    },
    family: {
      type: '',
      status: '',
      values: ''
    },
    horoscope: {
      required: false,
      manglik: ''
    }
  });

  const { permissions } = useBusinessLogic();

  const educationOptions = [
    'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 
    'PhD', 'Professional Degree', 'Engineering', 'Medical', 'MBA'
  ];

  const occupationOptions = [
    'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 
    'Government Employee', 'Private Employee', 'Lawyer', 'Consultant',
    'Finance Professional', 'Marketing Professional'
  ];

  const religionOptions = [
    'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'
  ];

  const performAdvancedSearch = async () => {
    setLoading(true);
    try {
      // Build request payload for enhanced search API
      const userData = storedUser;
      const userId = userData?.id || userData?.userId || null;

      if (!userId) {
        // No logged-in user: fall back to public GET /api/search with query params
        setInfoMessage('You are not logged in. Showing public search results (limited).');
        const params = new URLSearchParams();
        params.set('ageFrom', String(filters.ageRange[0]));
        params.set('ageTo', String(filters.ageRange[1]));
        // Only include location if provided
        if (filters.location) params.set('location', filters.location);

        if (filters.religion.length) params.set('religion', filters.religion.join(','));
        if (filters.occupation.length) params.set('occupation', filters.occupation.join(','));

        const url = '/api/search?' + params.toString();
        const res = await fetch(url);
        if (!res.ok) throw new Error('Public search API error');
        const data = await res.json();
        const mapped: Profile[] = (data.profiles || []).map((p: any) => ({
          id: p.id,
          name: p.name || p.user?.name || '',
          age: p.age || p.user?.age || 0,
          location: p.location || p.profile?.location || '',
          occupation: p.occupation || p.profile?.occupation || '',
          education: p.education || p.profile?.education || '',
          religion: p.religion || p.profile?.religion || '',
          height: p.minHeight || p.maxHeight ? `${p.minHeight || ''}${p.maxHeight ? ' - ' + p.maxHeight : ''}` : '',
          profileImage: (p.photos && p.photos[0]) || p.profileImage || '/uploads/1755858552715_user2.jpg',
          verified: !!(p.isVip || p.isFeatured),
          premium: !!p.packageName && p.packageName !== 'Free',
          matchPercentage: p.matchPercentage || 0,
          lastActive: p.userUpdatedAt || ''
        }));

        setProfiles(mapped);
        setSearchPerformed(true);
        return;
      }

      // Only include location if user provided it
      const locationStr = filters.location.trim() || undefined;

      const payload: any = {
        userId,
        heightRange: { min: filters.heightRange[0], max: filters.heightRange[1] },
        education: filters.education.length ? filters.education.join(',') : undefined,
        occupation: filters.occupation.length ? filters.occupation.join(',') : undefined,
        religion: filters.religion.length ? filters.religion.join(',') : undefined,
        maritalStatus: filters.maritalStatus.length ? filters.maritalStatus.join(',') : undefined,
        incomeRange: { min: filters.income.min, max: filters.income.max },
      };

      // Only include age range if it's valid
      if (filters.ageRange[0] > 0 && filters.ageRange[1] > 0 && filters.ageRange[0] <= filters.ageRange[1]) {
        payload.ageRange = { min: filters.ageRange[0], max: filters.ageRange[1] };
      }

      if (locationStr) payload.location = locationStr;

      const res = await fetch('/api/search/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Search API error');

      const data = await res.json();

      const mapped: Profile[] = (data.profiles || []).map((p: any) => ({
        id: p.id,
        name: p.name || p.user?.name || '',
        age: p.age || p.user?.age || 0,
        location: p.profile?.location || p.location || '',
        occupation: p.profile?.occupation || p.occupation || '',
        education: p.profile?.education || p.education || '',
        religion: p.profile?.religion || p.religion || '',
        height: (p.profile && (p.profile.minHeight || p.profile.maxHeight))
          ? `${p.profile.minHeight || ''}${p.profile.maxHeight ? ' - ' + p.profile.maxHeight : ''}`
          : p.height || '',
        profileImage: p.profile?.profileImage || p.profileImage || '/uploads/1755858552715_user2.jpg',
        verified: !!(p.isVip || p.isFeatured),
        premium: !!(p.subscription?.package?.name && p.subscription.package.name !== 'Free'),
        matchPercentage: p.matchPercentage || 0,
        lastActive: p.profile?.lastActive || p.lastActive || ''
      }));

      setProfiles(mapped);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error performing advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Read current user from storage (hook supports sessionStorage and localStorage)
  const [storedUser] = useLocalStorage<any>('user', null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
          <p className="text-gray-600">Find your perfect match with detailed search criteria</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Advanced Filters Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="flex items-center mb-6">
                <FiFilter className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.ageRange[0] === 0 ? '' : filters.ageRange[0]}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        setFilters(prev => ({ 
                          ...prev, 
                          ageRange: [value, prev.ageRange[1]] 
                        }));
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="18"
                      max="100"
                      placeholder="Min"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="number"
                      value={filters.ageRange[1] === 0 ? '' : filters.ageRange[1]}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        setFilters(prev => ({ 
                          ...prev, 
                          ageRange: [prev.ageRange[0], value] 
                        }));
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="18"
                      max="100"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter city, state, or country"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      location: e.target.value 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {educationOptions.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.education.includes(option)}
                          onChange={(e) => {
                            const newEducation = e.target.checked
                              ? [...filters.education, option]
                              : filters.education.filter(edu => edu !== option);
                            setFilters(prev => ({ ...prev, education: newEducation }));
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={performAdvancedSearch}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FiSearch className="w-4 h-4 mr-2" />
                      Search Profiles
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!searchPerformed ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600 mb-6">
                  Use the filters on the left to find profiles that match your specific criteria
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <FiTrendingUp className="w-4 h-4 mr-2" />
                    Smart Matching
                  </div>
                  <div className="flex items-center justify-center">
                    <FiStar className="w-4 h-4 mr-2" />
                    Verified Profiles
                  </div>
                  <div className="flex items-center justify-center">
                    <FiSettings className="w-4 h-4 mr-2" />
                    Custom Filters
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Results Header */}
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    {infoMessage && (
                      <div className="mb-3 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">{infoMessage}</div>
                    )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Search Results ({profiles.length} profiles found)
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiStar className="w-4 h-4" />
                      <span>Sorted by match percentage</span>
                    </div>
                  </div>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={profile.profileImage}
                          alt={profile.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {profile.matchPercentage}% Match
                          </span>
                        </div>
                        {profile.premium && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{profile.name}</h4>
                          <span className="text-gray-500 text-sm">{profile.age} years</span>
                        </div>
                        
                        <div className="space-y-1 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiMapPin className="w-3 h-3 mr-1" />
                            {profile.location}
                          </div>
                          <div className="flex items-center">
                            <FiBookOpen className="w-3 h-3 mr-1" />
                            {profile.education}
                          </div>
                          <div>
                            <strong>Occupation:</strong> {profile.occupation}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-xs text-gray-500">Active {profile.lastActive}</span>
                          <div className="flex space-x-2">
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <FiHeart className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                              <FiMessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {profiles.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria to find more profiles</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
