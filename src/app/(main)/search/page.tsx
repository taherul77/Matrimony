'use client';

import { useState } from 'react';

import SearchFilter from '@/components/SearchFilter';
import ProfileCard from '@/components/ProfileCard';
import { FiGrid, FiList } from 'react-icons/fi';


import { useEffect } from 'react';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);


  const fetchProfiles = async (filters: any = {}, pageNum = 1, append = false) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('limit', '6');
      params.append('page', pageNum.toString());
      if ((filters as any).ageFrom) params.append('ageFrom', (filters as any).ageFrom);
      if ((filters as any).ageTo) params.append('ageTo', (filters as any).ageTo);
      if ((filters as any).location) params.append('location', (filters as any).location);
      if ((filters as any).religion) params.append('religion', (filters as any).religion);
      if ((filters as any).caste) params.append('caste', (filters as any).caste);
      if ((filters as any).education) params.append('education', (filters as any).education);
      if ((filters as any).occupation) params.append('occupation', (filters as any).occupation);
      if ((filters as any).gender) params.append('gender', (filters as any).gender);
  if ((filters as any).keyword) params.append('keyword', (filters as any).keyword);
  const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      if (append) {
        setProfiles((prev) => [...prev, ...(data.profiles || [])]);
      } else {
        setProfiles(data.profiles || []);
      }
      setHasMore((data.profiles || []).length === 6);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfiles({}, 1, false);
  }, []);


  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
    setIsSearching(Object.values(filters).some((v) => v));
    setPage(1);
    fetchProfiles(filters, 1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProfiles(currentFilters, nextPage, true);
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

          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {profiles.length} Profiles Found
              </h2>
              {Object.keys(currentFilters).length > 0 && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                  Filters Applied
                </span>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {profiles.map((profile: any) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Load More Button */}
          {!isSearching && hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Profiles'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
