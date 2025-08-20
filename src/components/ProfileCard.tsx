'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiMapPin, FiBriefcase, FiBookOpen, FiStar } from 'react-icons/fi';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    occupation: string;
    education: string;
    photos: string[];
    bio: string;
    religion?: string;
    caste?: string;
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Photo Section */}
      <div className="relative h-96 bg-gradient-to-br from-pink-100 to-purple-100">
        <img
          src={profile.photos[currentPhotoIndex]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        {/* Photo Navigation */}
        {profile.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Photo Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {profile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Premium Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
          <FiStar className="w-3 h-3" />
          <span>Premium</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600 text-lg">{profile.age} years old</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">{profile.religion}</p>
            <p className="text-sm text-gray-500">{profile.caste}</p>
          </div>
        </div>

        {/* Location, Occupation, Education */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-gray-600">
            <FiMapPin className="w-5 h-5 text-pink-500" />
            <span className="text-base font-medium">{profile.location}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <FiBriefcase className="w-5 h-5 text-purple-500" />
            <span className="text-base font-medium">{profile.occupation}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <FiBookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-base font-medium">{profile.education}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{profile.bio}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Link href="/profile" className="flex-1">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
              View Profile
            </button>
          </Link>
          <button className="flex-1 border-2 border-pink-500 text-pink-500 py-3 px-4 rounded-full hover:bg-pink-50 hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
            Send Interest
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
