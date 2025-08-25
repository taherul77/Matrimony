

"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiMapPin, FiBriefcase, FiBookOpen, FiHeart, FiPhone } from "react-icons/fi";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  bio?: string;
}

interface Profile {
  id: string;
  userId: string;
  photos: string[];
  phone?: string;
  religion?: string;
  caste?: string;
  location?: string;
  occupation?: string;
  education?: string;
}

const DashboardProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
      }
    } catch (error) {
      // fallback to localStorage if API fails
      const userData = localStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const nextPhoto = () => {
    if (profile?.photos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }
  };
  const prevPhoto = () => {
    if (profile?.photos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 pt-20 pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Dashboard Profile
            </h1>
            <p className="text-xl text-white/90 mb-8">
              View your information and make a great first impression
            </p>
          </div>
        </div>
        {/* Decorative Elements */}
        {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgb(249, 250, 251)"></path>
          </svg>
        </div> */}
      </div>

      {/* Profile Content */}
      <div className="relative -mt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="relative w-40 h-40 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full overflow-hidden shadow-xl border-4 border-white">
                    {profile?.photos && profile.photos.length > 0 ? (
                      <img
                        src={profile.photos[currentPhotoIndex]}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No photo</p>
                        </div>
                      </div>
                    )}
                    {/* Photo Navigation */}
                    {profile?.photos && profile.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    {/* Photo Indicators */}
                    {profile?.photos && profile.photos.length > 1 && (
                      <div className="flex justify-center mt-4 space-x-2">
                        {profile.photos.map((_, index: number) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentPhotoIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Basic Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-xl text-gray-600 mb-4">{user.age} years old • {user.gender}</p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <FiMail className="inline mr-1" /> {user.email}
                    </span>
                    {profile?.location && (
                      <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        <FiMapPin className="inline mr-1" /> {profile.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Details Section */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <p className="text-gray-800 font-medium">{profile?.location || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Religion</label>
                      <p className="text-gray-800 font-medium">{profile?.religion || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Caste</label>
                      <p className="text-gray-800 font-medium">{profile?.caste || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <FiBriefcase className="w-4 h-4 text-white" />
                    </div>
                    Professional Info
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Occupation</label>
                      <p className="text-gray-800 font-medium">{profile?.occupation || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Education</label>
                      <p className="text-gray-800 font-medium">{profile?.education || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                      <FiMail className="w-4 h-4 text-white" />
                    </div>
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Email</label>
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Phone</label>
                      <p className="text-gray-800 font-medium">{profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bio Section */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <FiHeart className="w-5 h-5 text-white" />
                </div>
                About Me
              </h3>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfilePage;
