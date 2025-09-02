"use client";

import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { FiUsers, FiFilter, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface SearchProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  education?: string;
  location?: string;
  isOnline?: boolean;
  lastSeen?: string;
  photos: string[];
  bio?: string;
  isVip?: boolean;
  isFeatured?: boolean;
  hasProfileHighlight?: boolean;
  priorityLevel?: number;
  userId?: string;
}

interface SearchResultsProps {
  currentUserId: string;
  searchFilters?: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    education?: string;
    occupation?: string;
    maritalStatus?: string;
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  currentUserId, 
  searchFilters = {} 
}) => {
  const { permissions, loading: businessLoading } = useBusinessLogic(currentUserId);
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsCount, setResultsCount] = useState(0);

  useEffect(() => {
    const getResultsLimit = () => {
      if (!permissions) return 5; // Default for Free
      
      // Package-based search result limits
      if (permissions.hasAdvancedSearch && permissions.hasVipBadge) return 50; // VIP
      if (permissions.isFeatured) return 30; // Platinum  
      if (permissions.hasAdvancedSearch) return 20; // Gold
      if (permissions.hasProfileHighlight) return 15; // Silver
      return 10; // Free enhanced
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: getResultsLimit().toString(),
          ...Object.fromEntries(
            Object.entries(searchFilters).filter(([_, value]) => value !== undefined && value !== '')
          )
        });

        const response = await fetch(`/api/search?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setProfiles(data.profiles || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setResultsCount(data.pagination?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchFilters, permissions]);

  const fetchSearchResults = async () => {
    // This function is kept for the error retry button
    const getResultsLimit = () => {
      if (!permissions) return 5; // Default for Free
      
      // Package-based search result limits
      if (permissions.hasAdvancedSearch && permissions.hasVipBadge) return 50; // VIP
      if (permissions.isFeatured) return 30; // Platinum  
      if (permissions.hasAdvancedSearch) return 20; // Gold
      if (permissions.hasProfileHighlight) return 15; // Silver
      return 10; // Free enhanced
    };

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: getResultsLimit().toString(),
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await fetch(`/api/search?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setProfiles(data.profiles || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setResultsCount(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  const getResultsLimit = () => {
    if (!permissions) return 5; // Default for Free
    
    // Package-based search result limits
    if (permissions.hasAdvancedSearch && permissions.hasVipBadge) return 50; // VIP
    if (permissions.isFeatured) return 30; // Platinum  
    if (permissions.hasAdvancedSearch) return 20; // Gold
    if (permissions.hasProfileHighlight) return 15; // Silver
    return 10; // Free enhanced
  };

  const getUpgradeMessage = () => {
    if (!permissions) return null;

    if (!permissions.hasAdvancedSearch) {
      return {
        title: "Upgrade to Gold Package",
        message: "Advanced search filters and see 20 results per page",
        features: ["Advanced search", "20 results per page", "Profile highlights"]
      };
    }
    
    if (!permissions.isFeatured) {
      return {
        title: "Upgrade to Platinum Package", 
        message: "Featured profile status and see 30 results per page",
        features: ["Featured profile", "30 results per page", "Weekly profile boost"]
      };
    }

    if (!permissions.hasVipBadge) {
      return {
        title: "Upgrade to VIP Package",
        message: "VIP badge and see 50 results per page", 
        features: ["VIP badge", "50 results per page", "Top priority in search"]
      };
    }

    return null;
  };

  const getPackageIcon = (profile: SearchProfile) => {
    if (profile.isVip) return <FaCrown className="w-4 h-4 text-purple-500" />;
    if (profile.isFeatured) return <HiSparkles className="w-4 h-4 text-yellow-500" />;
    if (profile.hasProfileHighlight) return <FiStar className="w-4 h-4 text-blue-500" />;
    return null;
  };

  if (businessLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchSearchResults}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const upgradeInfo = getUpgradeMessage();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Results Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
                <p className="text-gray-600">
                  Found {resultsCount} profiles • Showing {getResultsLimit()} per page
                </p>
              </div>
            </div>
            
            {upgradeInfo && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Current limit: {getResultsLimit()} results</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Upgrade for more
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner */}
        {upgradeInfo && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">{upgradeInfo.title}</h3>
                <p className="text-blue-100 mb-3">{upgradeInfo.message}</p>
                <div className="flex gap-4 text-sm">
                  {upgradeInfo.features.map((feature, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <FiStar className="w-4 h-4" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {profiles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFilter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No profiles found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search filters or expanding your criteria to find more matches.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {profiles.map((profile) => (
                <div key={profile.id} className="relative">
                  {/* Package Badge */}
                  {getPackageIcon(profile) && (
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      {getPackageIcon(profile)}
                    </div>
                  )}
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  Page {currentPage} of {totalPages} • {resultsCount} total results
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
