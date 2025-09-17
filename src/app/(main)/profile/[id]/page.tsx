'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OptimizedRealTimeChat from '@/components/OptimizedRealTimeChat';
import { generateUniqueKey } from '@/lib/utils';

import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiX, FiMapPin, FiBriefcase, FiBookOpen, FiUser, FiMail, FiPhone, FiShare, FiFlag } from 'react-icons/fi';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bio?: string;
  profile?: {
    id: string;
    userId: string;
    photos: string[];
    phone?: string;
    religion?: string;
    caste?: string;
    location?: string;
    occupation?: string;
    education?: string;
  };
}

export default function ViewProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch from database API
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchCurrentUser();
    }
  }, [userId]);

  const nextPhoto = () => {
    if (user?.profile?.photos && user.profile.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % user.profile!.photos.length);
    }
  };

  const prevPhoto = () => {
    if (user?.profile?.photos && user.profile.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + user.profile!.photos.length) % user.profile!.photos.length);
    }
  };

  const [interestMessage, setInterestMessage] = useState('');
  const [sendingInterest, setSendingInterest] = useState(false);

  const handleSendInterest = () => {
    setShowInterestModal(true);
  };

  const handleSendMessage = () => {
    setShowChatModal(true);
  };

  const sendInterest = async () => {
    if (!userId) return;
    
    setSendingInterest(true);
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: userId,
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you can add API call to save the like
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Profile not found</p>
          <Link href="/matches" className="text-blue-500 hover:text-blue-600">
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      
      
      {/* Navigation */}
      <div className="pt-20 pb-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/matches" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Matches
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Header with Photos */}
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-blue-100 to-teal-100">
                {user.profile?.photos && user.profile.photos.length > 0 ? (
                  <img
                    src={user.profile.photos[currentPhotoIndex]}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FiUser className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No photos available</p>
                    </div>
                  </div>
                )}

                {/* Photo Navigation */}
                {user.profile?.photos && user.profile.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-3 hover:bg-white transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-3 hover:bg-white transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors shadow-lg">
                    <FiShare className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors shadow-lg">
                    <FiFlag className="w-5 h-5" />
                  </button>
                </div>

                {/* Photo Indicators */}
                {user.profile?.photos && user.profile.photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {user.profile.photos.map((photo, index: number) => (
                      <div
                        key={generateUniqueKey('photo-indicator', userId, index, photo.substring(photo.lastIndexOf('/') + 1, photo.lastIndexOf('.')))}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentPhotoIndex ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-8">
              {/* Basic Info */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{user.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{user.age} years old • {user.gender}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {user.profile?.location && (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      📍 {user.profile.location}
                    </span>
                  )}
                  {user.profile?.religion && (
                    <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      🕉️ {user.profile.religion}
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    Personal Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Location</label>
                      <p className="text-gray-800 font-medium">{user.profile?.location || 'Not specified'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Religion</label>
                      <p className="text-gray-800 font-medium">{user.profile?.religion || 'Not specified'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Caste</label>
                      <p className="text-gray-800 font-medium">{user.profile?.caste || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <FiBriefcase className="w-4 h-4 text-white" />
                    </div>
                    Professional Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Occupation</label>
                      <p className="text-gray-800 font-medium">{user.profile?.occupation || 'Not specified'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Education</label>
                      <p className="text-gray-800 font-medium">{user.profile?.education || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <FiMail className="w-4 h-4 text-white" />
                    </div>
                    Contact Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Email</label>
                      <p className="text-gray-500 font-medium">Contact after connection</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Phone</label>
                      <p className="text-gray-500 font-medium">Contact after connection</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">About {user.name}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {user.bio || 'No bio available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button 
                  onClick={handleSendInterest}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiHeart className="w-5 h-5" />
                  <span>Send Interest</span>
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="flex-1 border-2 border-blue-500 text-blue-600 py-4 px-6 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FiMail className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
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
              <p className="text-gray-600">Express your interest in {user.name}</p>
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

      {/* Chat Modal */}
      {showChatModal && currentUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profile?.photos?.[0] || '/default-avatar.png'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">Start a conversation</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <OptimizedRealTimeChat
                currentUserId={currentUser.id}
                receiverId={userId}
                receiverName={user.name}
                receiverImage={user.profile?.photos?.[0]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
