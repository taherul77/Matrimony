'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';
import { FiEdit, FiCamera, FiMapPin, FiBriefcase, FiBookOpen, FiHeart, FiUser, FiMail, FiPhone } from 'react-icons/fi';

// Demo user data
const demoUser = {
  name: 'Priya Sharma',
  age: 25,
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, Maharashtra',
  occupation: 'Software Engineer',
  education: 'B.Tech Computer Science',
  religion: 'Hindu',
  caste: 'Brahmin',
  bio: 'I am a passionate software engineer who loves to travel and explore new places. Looking for someone who shares similar values and goals in life. I enjoy reading, cooking, and spending time with family.',
  photos: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  preferences: {
    ageRange: '24-30',
    location: 'Mumbai, Pune, Bangalore',
    religion: 'Hindu',
    education: 'Graduate or above'
  }
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % demoUser.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + demoUser.photos.length) % demoUser.photos.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FiEdit className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Photo */}
              <div className="md:col-span-1">
                <div className="relative">
                  <div className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden">
                    <img
                      src={demoUser.photos[currentPhotoIndex]}
                      alt={demoUser.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Photo Navigation */}
                    {demoUser.photos.length > 1 && (
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
                          {demoUser.photos.map((_, index) => (
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

                    {/* Add Photo Button */}
                    <button className="absolute bottom-4 right-4 bg-white/80 rounded-full p-3 hover:bg-white transition-colors">
                      <FiCamera className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{demoUser.name}</h2>
                    <p className="text-gray-600">{demoUser.age} years old</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiMapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.location}</span>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiBriefcase className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.occupation}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiBookOpen className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.education}</span>
                    </div>
                  </div>

                  {/* Religious Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{demoUser.religion} • {demoUser.caste}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">About Me</h3>
            <p className="text-gray-700 leading-relaxed">{demoUser.bio}</p>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Partner Preferences</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Range:</span>
                  <span className="font-medium">{demoUser.preferences.ageRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{demoUser.preferences.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Religion:</span>
                  <span className="font-medium">{demoUser.preferences.religion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Education:</span>
                  <span className="font-medium">{demoUser.preferences.education}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/matches" className="flex-1">
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                <FiHeart className="inline w-5 h-5 mr-2" />
                View My Matches
              </button>
            </Link>
            <button className="flex-1 border-2 border-pink-500 text-pink-500 py-3 px-6 rounded-lg font-semibold hover:bg-pink-50 hover:scale-105 transition-all duration-300">
              Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
