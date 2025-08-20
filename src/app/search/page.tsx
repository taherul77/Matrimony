'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import SearchFilter from '../../components/SearchFilter';
import ProfileCard from '../../components/ProfileCard';
import { FiGrid, FiList, FiHeart } from 'react-icons/fi';

// Extended demo data for search results
const searchResults = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 25,
    location: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    education: 'B.Tech Computer Science',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'I am a passionate software engineer who loves to travel and explore new places. Looking for someone who shares similar values and goals in life.',
    religion: 'Hindu',
    caste: 'Brahmin'
  },
  {
    id: '2',
    name: 'Aisha Khan',
    age: 27,
    location: 'Delhi, NCR',
    occupation: 'Marketing Manager',
    education: 'MBA Marketing',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Creative and ambitious marketing professional who enjoys reading, cooking, and spending time with family. Seeking a life partner who is kind and family-oriented.',
    religion: 'Muslim',
    caste: 'Sunni'
  },
  {
    id: '3',
    name: 'Rahul Patel',
    age: 28,
    location: 'Bangalore, Karnataka',
    occupation: 'Data Scientist',
    education: 'M.Tech Data Science',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Tech enthusiast and fitness lover. I believe in continuous learning and personal growth. Looking for someone who is ambitious and has a positive outlook on life.',
    religion: 'Hindu',
    caste: 'Patel'
  },
  {
    id: '4',
    name: 'Sarah Thomas',
    age: 26,
    location: 'Chennai, Tamil Nadu',
    occupation: 'Doctor',
    education: 'MBBS, MD',
    photos: [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Dedicated doctor with a passion for helping others. I love music, dance, and spending time with friends. Seeking a partner who is caring and understanding.',
    religion: 'Christian',
    caste: 'Syrian Christian'
  },
  {
    id: '5',
    name: 'Meera Reddy',
    age: 24,
    location: 'Hyderabad, Telangana',
    occupation: 'UX Designer',
    education: 'B.Des Design',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Creative designer who loves art, photography, and exploring new cultures. Looking for someone who appreciates creativity and has a zest for life.',
    religion: 'Hindu',
    caste: 'Reddy'
  },
  {
    id: '6',
    name: 'Arjun Singh',
    age: 29,
    location: 'Pune, Maharashtra',
    occupation: 'Investment Banker',
    education: 'MBA Finance',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Ambitious professional with a passion for finance and travel. I enjoy reading, playing sports, and spending quality time with family and friends.',
    religion: 'Hindu',
    caste: 'Rajput'
  },
  {
    id: '7',
    name: 'Fatima Ali',
    age: 25,
    location: 'Lucknow, Uttar Pradesh',
    occupation: 'Architect',
    education: 'B.Arch Architecture',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Creative architect who loves designing beautiful spaces. I enjoy cooking, gardening, and spending time with my family. Looking for someone who is kind and family-oriented.',
    religion: 'Muslim',
    caste: 'Shia'
  },
  {
    id: '8',
    name: 'Vikram Malhotra',
    age: 27,
    location: 'Gurgaon, Haryana',
    occupation: 'Product Manager',
    education: 'B.Tech + MBA',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
    ],
    bio: 'Product manager with a passion for technology and innovation. I love reading, playing guitar, and exploring new places. Seeking someone who is ambitious and has similar interests.',
    religion: 'Hindu',
    caste: 'Agarwal'
  }
];

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState({});

  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
    console.log('Applied filters:', filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
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
                {searchResults.length} Profiles Found
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
            {searchResults.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300">
              Load More Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
