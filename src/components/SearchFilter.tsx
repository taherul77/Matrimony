'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

interface SearchFilterProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilter = ({ onFilterChange }: SearchFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    ageFrom: '',
    ageTo: '',
    location: '',
    religion: '',
    caste: '',
    education: '',
    occupation: '',
    gender: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, or keywords..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
        >
          <FiFilter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.ageFrom}
                  onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={filters.ageTo}
                  onChange={(e) => handleFilterChange('ageTo', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Any Religion</option>
                <option value="hindu">Hindu</option>
                <option value="muslim">Muslim</option>
                <option value="christian">Christian</option>
                <option value="sikh">Sikh</option>
                <option value="buddhist">Buddhist</option>
                <option value="jain">Jain</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Looking for</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <select
                value={filters.education}
                onChange={(e) => handleFilterChange('education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Any Education</option>
                <option value="high-school">High School</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="diploma">Diploma</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <select
                value={filters.occupation}
                onChange={(e) => handleFilterChange('occupation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Any Occupation</option>
                <option value="software-engineer">Software Engineer</option>
                <option value="doctor">Doctor</option>
                <option value="teacher">Teacher</option>
                <option value="business">Business</option>
                <option value="government">Government</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Caste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <input
                type="text"
                placeholder="Enter caste"
                value={filters.caste}
                onChange={(e) => handleFilterChange('caste', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
                              <button
                  onClick={() => {
                    setFilters({
                      ageFrom: '',
                      ageTo: '',
                      location: '',
                      religion: '',
                      caste: '',
                      education: '',
                      occupation: '',
                      gender: ''
                    });
                    onFilterChange({});
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Clear Filters
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
