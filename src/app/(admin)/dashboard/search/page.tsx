"use client";

import React, { useState, useEffect } from "react";
import { SearchFilter, SearchResults } from "@/components";
import { useLocalStorage } from "@/hooks/useClientOnly";

const DashboardSearchPage: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userData] = useLocalStorage("user", null);

  useEffect(() => {
    // Get user ID from localStorage
    if (userData) {
      try {
        const user =
          typeof userData === "string" ? JSON.parse(userData) : userData;
        setCurrentUserId(user.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [userData]);

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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 flex items-center gap-3 ">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full ">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Search Profiles
            </h1>
            <p className="text-gray-600">
              Find your perfect match with our advanced search filters.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 lg:mb-0 transition hover:shadow-2xl">
          <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
              />
            </svg>
            Filters
          </h2>
          <SearchFilter onFilterChange={handleSearch} />
        </div>
        <div className="mt-8">
          <div className="bg-gradient-to-br from-blue-100 via-white to-gray-100 rounded-2xl shadow-xl p-8 transition hover:shadow-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-200">
                  <svg
                    className="h-5 w-5 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16h6"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-bold text-blue-800 tracking-tight">
                  Results
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                Showing matches based on your filters
              </span>
            </div>
            <div className="space-y-6">
              <SearchResults
                currentUserId={currentUserId}
                searchFilters={searchFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSearchPage;
