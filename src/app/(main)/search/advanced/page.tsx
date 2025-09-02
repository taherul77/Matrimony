"use client";

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiStar, FiMapPin, FiUser, FiHeart, FiDollarSign, FiBookOpen } from 'react-icons/fi';

const AdvancedSearchPage: React.FC = () => {
  const [filters, setFilters] = useState({
    ageRange: [25, 35],
    location: '',
    religion: '',
    caste: '',
    maritalStatus: '',
    education: '',
    occupation: '',
    incomeRange: [0, 1000000],
    heightRange: [150, 180],
    lifestyle: '',
    languages: [],
    country: ''
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const religionOptions = [
    'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other'
  ];

  const educationOptions = [
    'High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Degree', 'Other'
  ];

  const occupationOptions = [
    'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Lawyer', 'Engineer', 'Government Job', 'Other'
  ];

  const lifestyleOptions = [
    'Traditional', 'Modern', 'Religious', 'Spiritual', 'Fitness Oriented', 'Family Oriented'
  ];

  const languageOptions = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Malayalam', 'Kannada'
  ];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to search with filters
      // For now, we'll simulate a search
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResults([]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [25, 35],
      location: '',
      religion: '',
      caste: '',
      maritalStatus: '',
      education: '',
      occupation: '',
      incomeRange: [0, 1000000],
      heightRange: [150, 180],
      lifestyle: '',
      languages: [],
      country: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiSearch className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
            <div className="ml-4 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
              <span className="text-purple-700 font-medium text-sm">Premium Feature</span>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Find your perfect match with detailed filters and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiFilter className="w-5 h-5 mr-2" />
                  Search Filters
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={filters.ageRange[0]}
                      onChange={(e) => handleFilterChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={filters.ageRange[1]}
                      onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter city or state"
                  />
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    value={filters.religion}
                    onChange={(e) => handleFilterChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Religion</option>
                    {religionOptions.map(religion => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={filters.maritalStatus}
                    onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiBookOpen className="w-4 h-4 inline mr-1" />
                    Education
                  </label>
                  <select
                    value={filters.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Education</option>
                    {educationOptions.map(education => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="w-4 h-4 inline mr-1" />
                    Occupation
                  </label>
                  <select
                    value={filters.occupation}
                    onChange={(e) => handleFilterChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Occupation</option>
                    {occupationOptions.map(occupation => (
                      <option key={occupation} value={occupation}>{occupation}</option>
                    ))}
                  </select>
                </div>

                {/* Income Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="w-4 h-4 inline mr-1" />
                    Annual Income (₹)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={filters.incomeRange[0]}
                      onChange={(e) => handleFilterChange('incomeRange', [parseInt(e.target.value), filters.incomeRange[1]])}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={filters.incomeRange[1]}
                      onChange={(e) => handleFilterChange('incomeRange', [filters.incomeRange[0], parseInt(e.target.value)])}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Height Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={filters.heightRange[0]}
                      onChange={(e) => handleFilterChange('heightRange', [parseInt(e.target.value), filters.heightRange[1]])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={filters.heightRange[1]}
                      onChange={(e) => handleFilterChange('heightRange', [filters.heightRange[0], parseInt(e.target.value)])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Lifestyle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lifestyle
                  </label>
                  <select
                    value={filters.lifestyle}
                    onChange={(e) => handleFilterChange('lifestyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Lifestyle</option>
                    {lifestyleOptions.map(lifestyle => (
                      <option key={lifestyle} value={lifestyle}>{lifestyle}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
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

          {/* Search Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Searching Profiles...</h3>
                <p className="text-gray-600">Using advanced algorithms to find your perfect matches</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search Stats */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                      <p className="text-gray-600">Found 0 profiles matching your criteria</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option>Sort by Relevance</option>
                        <option>Recently Active</option>
                        <option>Newest First</option>
                        <option>Age: Low to High</option>
                        <option>Age: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* No Results */}
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria to find more matches
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={resetFilters}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Reset Filters
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse All Profiles
                    </button>
                  </div>
                </div>

                {/* Premium Features Showcase */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
                  <div className="text-center">
                    <FiStar className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                    <h3 className="text-2xl font-bold mb-4">Enhanced Search Features</h3>
                    <p className="text-lg opacity-90 mb-6">
                      Get access to more advanced filters and AI-powered matching with premium plans
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <FiHeart className="w-6 h-6 mx-auto mb-2" />
                        <h4 className="font-semibold">Compatibility Score</h4>
                        <p className="text-sm opacity-80">AI-powered matching</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <FiUser className="w-6 h-6 mx-auto mb-2" />
                        <h4 className="font-semibold">Verified Profiles</h4>
                        <p className="text-sm opacity-80">Priority in results</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <FiStar className="w-6 h-6 mx-auto mb-2" />
                        <h4 className="font-semibold">Featured Search</h4>
                        <p className="text-sm opacity-80">Premium visibility</p>
                      </div>
                    </div>
                    <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
