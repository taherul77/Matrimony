"use client";

import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiShield, FiBell, FiLock, FiHeart, FiCreditCard, FiHelpCircle } from 'react-icons/fi';
import Link from 'next/link';

const DashboardSettingsPage: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to access settings</div>
        </div>
      </div>
    );
  }

  const settingsCategories = [
    {
      title: 'Account Settings',
      description: 'Manage your personal information and account details',
      icon: FiUser,
      href: '/dashboard/settings/account',
      color: 'bg-blue-500'
    },
    {
      title: 'Privacy Settings',
      description: 'Control who can see your profile and contact you',
      icon: FiShield,
      href: '/dashboard/settings/privacy',
      color: 'bg-green-500'
    },
    {
      title: 'Notification Settings',
      description: 'Choose how you want to be notified',
      icon: FiBell,
      href: '/dashboard/settings/notifications',
      color: 'bg-yellow-500'
    },
    {
      title: 'Preference Settings',
      description: 'Set your partner preferences and matching criteria',
      icon: FiHeart,
      href: '/dashboard/settings/preferences',
      color: 'bg-pink-500'
    },
    {
      title: 'Security Settings',
      description: 'Manage login security and two-factor authentication',
      icon: FiLock,
      href: '/dashboard/settings/security',
      color: 'bg-red-500'
    },
    {
      title: 'Subscription Settings',
      description: 'Manage your subscription and billing information',
      icon: FiCreditCard,
      href: '/dashboard/settings/subscription',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiSettings className="w-8 h-8 mr-3 text-blue-600" />
            Settings
          </h1>
          <p className="text-gray-600">Manage your account, privacy, and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.title}
                href={category.href}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${category.color} rounded-lg p-3 text-white`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="font-medium text-gray-900">Update Profile Photo</div>
              <div className="text-sm text-gray-600">Change your profile picture</div>
            </button>
            <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-600">Update your login password</div>
            </button>
            <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="font-medium text-gray-900">Privacy Mode</div>
              <div className="text-sm text-gray-600">Hide your profile temporarily</div>
            </button>
            <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="font-medium text-gray-900">Download Data</div>
              <div className="text-sm text-gray-600">Export your account data</div>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiHelpCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Contact Support
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
              View Help Center
            </button>
          </div>
        </div>

        {/* Account Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">High</div>
              <div className="text-sm text-gray-600">Privacy Level</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Premium</div>
              <div className="text-sm text-gray-600">Membership Type</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
