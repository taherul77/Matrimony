'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard';
import { FiHeart, FiFilter, FiGrid, FiList } from 'react-icons/fi';

// Demo matches data
const demoMatches = [
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
    caste: 'Brahmin',
    matchPercentage: 95
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
    caste: 'Sunni',
    matchPercentage: 88
  },
  {
    id: '3',
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
    caste: 'Syrian Christian',
    matchPercentage: 92
  },
  {
    id: '4',
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
    caste: 'Reddy',
    matchPercentage: 85
  }
];

export default function MatchesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('matchPercentage');

  const sortedMatches = [...demoMatches].sort((a, b) => {
    if (sortBy === 'matchPercentage') {
      return b.matchPercentage - a.matchPercentage;
    }
    if (sortBy === 'age') {
      return a.age - b.age;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Matches</h1>
            <p className="text-xl text-gray-600">
              Discover people who match your preferences and interests
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="matchPercentage">Match Percentage</option>
                <option value="age">Age</option>
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Match Percentage Badges */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMatches.map((match) => (
              <div key={match.id} className="relative">
                <ProfileCard profile={match} />
                {/* Match Percentage Badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {match.matchPercentage}% Match
                </div>
              </div>
            ))}
          </div>

          {/* No More Matches Message */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <FiHeart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No More Matches</h3>
              <p className="text-gray-600 mb-4">
                You've seen all your current matches. Check back later for new profiles!
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold">
                Update Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
