"use client";

import React, { useState, useEffect } from 'react';
import { SearchFilter, SearchResults } from '@/components';

const DashboardSearchPage: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  // Don't render until we have user ID
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Profiles</h1>
          <p className="text-gray-600">Find your perfect match with our search filters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <SearchFilter 
              onFilterChange={handleSearch}
            />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchResults 
              currentUserId={currentUserId}
              searchFilters={searchFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSearchPage;
