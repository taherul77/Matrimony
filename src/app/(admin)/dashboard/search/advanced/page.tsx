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

interface AdvancedFilters {
  ageRange: [number, number];
  heightRange: [number, number];
  location: {
    city: string;
    state: string;
    country: string;
  };
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
  const [filters, setFilters] = useState<AdvancedFilters>({
    ageRange: [22, 35],
    heightRange: [150, 180],
    location: {
      city: '',
      state: '',
      country: 'India'
    },
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
      // Mock advanced search results
      const mockProfiles: Profile[] = [
        {
          id: '1',
          name: 'Priya Sharma',
          age: 26,
          location: 'Mumbai, Maharashtra',
          occupation: 'Software Engineer',
          education: 'B.Tech Computer Science',
          religion: 'Hindu',
          height: "5'4\"",
          profileImage: '/uploads/1755858552715_user2.jpg',
          verified: true,
          premium: false,
          matchPercentage: 95,
          lastActive: '2 hours ago'
        },
        {
          id: '2',
          name: 'Anita Patel',
          age: 24,
          location: 'Ahmedabad, Gujarat',
          occupation: 'Doctor',
          education: 'MBBS',
          religion: 'Hindu',
          height: "5'3\"",
          profileImage: '/uploads/1755863927941_user2.jpg',
          verified: true,
          premium: true,
          matchPercentage: 88,
          lastActive: '1 day ago'
        }
      ];
      setProfiles(mockProfiles);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error performing advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

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
                      value={filters.ageRange[0]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        ageRange: [Number(e.target.value), prev.ageRange[1]] 
                      }))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="18"
                      max="100"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="number"
                      value={filters.ageRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        ageRange: [prev.ageRange[0], Number(e.target.value)] 
                      }))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      min="18"
                      max="100"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={filters.location.city}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={filters.location.state}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, state: e.target.value } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
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
