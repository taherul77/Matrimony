'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiMapPin, FiBriefcase, FiBookOpen, FiStar } from 'react-icons/fi';

interface ProfileCardProps {
  profile: {
    id: string;
    userId?: string;
    name: string;
    age: number;
    bio?: string;
    profile?: {
      location?: string;
      occupation?: string;
      education?: string;
      photos?: string[];
      religion?: string;
      caste?: string;
    };
    // For backward compatibility with old structure
    location?: string;
    occupation?: string;
    education?: string;
    photos?: string[];
    religion?: string;
    caste?: string;
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [sendingInterest, setSendingInterest] = useState(false);

  // Get data from either new structure (profile.profile) or old structure (direct)
  const photos = profile.profile?.photos || profile.photos || [];
  const location = profile.profile?.location || profile.location || '';
  const occupation = profile.profile?.occupation || profile.occupation || '';
  const education = profile.profile?.education || profile.education || '';
  const religion = profile.profile?.religion || profile.religion || '';
  const caste = profile.profile?.caste || profile.caste || '';

  const nextPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const sendInterest = async () => {
    setSendingInterest(true);
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: profile.id,
          message: interestMessage || 'I am interested in your profile'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Interest sent successfully!');
        setShowInterestModal(false);
        setInterestMessage('');
      } else {
        alert(data.error || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Failed to send interest. Please try again.');
    } finally {
      setSendingInterest(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Photo Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-teal-100">
        <img
          src={photos[currentPhotoIndex] || '/placeholder-avatar.jpg'}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        {/* Photo Navigation */}
        {photos.length > 1 && (
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
              {photos.map((_, index) => (
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
            <p className="text-sm text-gray-500 font-medium">{religion}</p>
            <p className="text-sm text-gray-500">{caste}</p>
          </div>
        </div>

        {/* Location, Occupation, Education */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-gray-600">
            <FiMapPin className="w-5 h-5 text-blue-500" />
            <span className="text-base font-medium">{location}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <FiBriefcase className="w-5 h-5 text-teal-500" />
            <span className="text-base font-medium">{occupation}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <FiBookOpen className="w-5 h-5 text-cyan-500" />
            <span className="text-base font-medium">{education}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{profile.bio}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Link href={`/profile/${profile.userId || profile.id}`} className="flex-1">
            <button className="w-full bg-gradient-to-r from-blue-500 to-teal-600 text-white py-3 px-4 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
              View Profile
            </button>
          </Link>
          <button 
            onClick={() => setShowInterestModal(true)}
            className="flex-1 border-2 border-blue-500 text-blue-600 py-3 px-4 rounded-full hover:bg-blue-50 hover:scale-105 transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
          >
            Send Interest
          </button>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Send Interest</h3>
              <p className="text-gray-600">Express your interest in {profile.name}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Add a personal message (optional)
              </label>
              <textarea
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                placeholder="Write a brief message to introduce yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{interestMessage.length}/200 characters</p>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowInterestModal(false)}
                disabled={sendingInterest}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={sendInterest}
                disabled={sendingInterest}
                className="flex-1 bg-gradient-to-r from-blue-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {sendingInterest ? 'Sending...' : 'Send Interest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
