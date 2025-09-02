'use client';

import { useState, useEffect } from 'react';
import SearchFilter from '@/components/SearchFilter';
import { SearchResults } from '@/components';

export default function SearchPage() {
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // Get current user ID from session/auth
    const getCurrentUser = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.isLoggedIn && data.user) {
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Match</h1>
            <p className="text-xl text-gray-600">
              Discover amazing people who are looking for their life partner
            </p>
          </div>

          {/* Search Filters */}
          <SearchFilter onFilterChange={handleFilterChange} />

          {/* Package-Based Search Results */}
          <SearchResults 
            currentUserId={currentUserId}
            searchFilters={currentFilters}
          />
        </div>
      </div>
    </div>
  );
}
