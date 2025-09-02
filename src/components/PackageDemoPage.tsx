"use client";

import React, { useState } from 'react';
import {
  InterestButton,
  ContactDetails,
  PhotoUpload,
  MessagingComponent,
  ProfileCard,
  SearchResults,
  PackageComparison
} from '@/components';
import { FiPackage, FiStar, FiUsers, FiSearch, FiHeart, FiCamera, FiMessageSquare, FiEye } from 'react-icons/fi';

const PackageDemoPage: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string>('overview');

  // Mock data for demos
  const mockProfile = {
    id: 'demo-profile-1',
    name: 'Priya Sharma',
    age: 28,
    gender: 'female',
    occupation: 'Software Engineer',
    education: 'B.Tech Computer Science',
    location: 'Mumbai, Maharashtra',
    isOnline: true,
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b69e9b77?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ],
    bio: 'Looking for a life partner who shares my values and ambitions.',
    isVip: true,
    isFeatured: true,
    hasProfileHighlight: true,
    priorityLevel: 3
  };

  const demoSections = [
    {
      id: 'overview',
      name: 'Package Overview',
      icon: <FiPackage className="w-5 h-5" />,
      description: 'Compare all 5 matrimonial packages'
    },
    {
      id: 'profile',
      name: 'Profile Card',
      icon: <FiUsers className="w-5 h-5" />,
      description: 'Package-aware profile display'
    },
    {
      id: 'search',
      name: 'Search Results',
      icon: <FiSearch className="w-5 h-5" />,
      description: 'Package-based search limits'
    },
    {
      id: 'interest',
      name: 'Interest Button',
      icon: <FiHeart className="w-5 h-5" />,
      description: 'Daily interest limits by package'
    },
    {
      id: 'contact',
      name: 'Contact Details',
      icon: <FiEye className="w-5 h-5" />,
      description: 'Package-based contact visibility'
    },
    {
      id: 'photos',
      name: 'Photo Upload',
      icon: <FiCamera className="w-5 h-5" />,
      description: 'Upload limits by package tier'
    },
    {
      id: 'messaging',
      name: 'Messaging',
      icon: <FiMessageSquare className="w-5 h-5" />,
      description: 'Monthly message limits'
    }
  ];

  const packageTiers = [
    {
      name: 'Free',
      color: 'gray',
      features: ['2 photos', '3 interests/day', 'Receive messages only', 'Basic search']
    },
    {
      name: 'Silver',
      color: 'blue',
      features: ['5 photos', '10 interests/day', '50 messages/month', 'Profile highlight']
    },
    {
      name: 'Gold',
      color: 'yellow',
      features: ['10 photos', '25 interests/day', '150 messages/month', 'Advanced search']
    },
    {
      name: 'Platinum',
      color: 'purple',
      features: ['15 photos', '50 interests/day', '300 messages/month', 'Featured profile']
    },
    {
      name: 'VIP',
      color: 'pink',
      features: ['Unlimited photos', 'Unlimited interests', 'Unlimited messages', 'Personal matchmaker']
    }
  ];

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Matrimonial Package System</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our comprehensive 5-tier package system provides different levels of features and access 
                to help users find their perfect match based on their needs and budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {packageTiers.map((pkg) => (
                <div key={pkg.name} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-bold text-${pkg.color}-600 mb-2`}>{pkg.name}</h3>
                    <div className={`w-12 h-12 bg-${pkg.color}-100 rounded-full flex items-center justify-center mx-auto`}>
                      <FiStar className={`w-6 h-6 text-${pkg.color}-600`} />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 bg-${pkg.color}-500 rounded-full`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowComparison(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                View Detailed Comparison
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Package-Aware Profile Card</h2>
              <p className="text-gray-600">Profile cards display package badges and enforce interaction limits</p>
            </div>
            <div className="max-w-md mx-auto">
              <ProfileCard profile={mockProfile} />
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Package-Based Search Results</h2>
              <p className="text-gray-600">Search results and limits vary by package tier</p>
            </div>
            <SearchResults currentUserId="demo-user" />
          </div>
        );

      case 'interest':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Interest Button with Daily Limits</h2>
              <p className="text-gray-600">Interest sending limits enforced by package type</p>
            </div>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
              <InterestButton targetUserId="demo-target" currentUserId="demo-user" />
              <div className="mt-4 text-sm text-gray-500">
                <p>• Free: 3 interests per day</p>
                <p>• Silver: 10 interests per day</p>
                <p>• Gold: 25 interests per day</p>
                <p>• Platinum: 50 interests per day</p>
                <p>• VIP: Unlimited interests</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Details with Package Restrictions</h2>
              <p className="text-gray-600">Contact information visibility based on package level</p>
            </div>
            <div className="max-w-md mx-auto">
              <ContactDetails 
                targetUserId="demo-profile"
                currentUserId="demo-user"
                userPhone="+91 98765 43210"
                userEmail="priya.sharma@email.com"
              />
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Photo Upload with Package Limits</h2>
              <p className="text-gray-600">Upload limits enforced by subscription tier</p>
            </div>
            <div className="max-w-md mx-auto">
              <PhotoUpload 
                currentUserId="demo-user" 
                existingPhotos={[
                  'https://images.unsplash.com/photo-1494790108755-2616b69e9b77?w=400',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
                ]}
              />
            </div>
          </div>
        );

      case 'messaging':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Messaging with Monthly Limits</h2>
              <p className="text-gray-600">Message sending limits based on package</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <MessagingComponent 
                currentUserId="demo-user"
                targetUserId="demo-other"
                targetUserName="Priya Sharma"
                currentUserPackage="Silver"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Package Demo</h1>
              <p className="text-gray-600">Matrimonial Platform Business Logic Implementation</p>
            </div>
            <button
              onClick={() => setShowComparison(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Compare Packages
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Demo Components</h3>
              <nav className="space-y-2">
                {demoSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveDemo(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeDemo === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[600px]">
              {renderDemoContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Package Comparison Modal */}
      <PackageComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        currentPackage="silver"
      />
    </div>
  );
};

export default PackageDemoPage;
