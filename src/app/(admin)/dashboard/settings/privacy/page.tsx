"use client";

import React, { useState, useEffect } from 'react';
import { FiShield, FiEye, FiEyeOff, FiUsers, FiLock } from 'react-icons/fi';

interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'premium';
  showOnlineStatus: boolean;
  allowDirectContact: boolean;
  showProfileViews: boolean;
  hideFromSearch: boolean;
  sharePhoneNumber: boolean;
  shareEmail: boolean;
  allowProfileScreenshots: boolean;
}

const DashboardPrivacySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'members',
    showOnlineStatus: true,
    allowDirectContact: true,
    showProfileViews: true,
    hideFromSearch: false,
    sharePhoneNumber: false,
    shareEmail: false,
    allowProfileScreenshots: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacySettings = async (userId: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/privacy-settings?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setSettings(prevSettings => data.settings || prevSettings);
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
          fetchPrivacySettings(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const handleSave = async () => {
    if (!currentUserId) return;

    try {
      setSaving(true);
      const response = await fetch('/api/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          settings
        }),
      });

      if (response.ok) {
        alert('Privacy settings saved successfully!');
      } else {
        alert('Failed to save privacy settings');
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Error saving privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to manage privacy settings</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading privacy settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiShield className="w-8 h-8 mr-3 text-blue-600" />
              Privacy Settings
            </h1>
            <p className="text-gray-600">Control who can see your profile and contact you</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiEye className="w-5 h-5 mr-2" />
              Profile Visibility
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={settings.profileVisibility === 'public'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Public</div>
                  <div className="text-sm text-gray-600">Anyone can view your profile</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="members"
                  checked={settings.profileVisibility === 'members'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Members Only</div>
                  <div className="text-sm text-gray-600">Only registered members can view your profile</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="premium"
                  checked={settings.profileVisibility === 'premium'}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Premium Members Only</div>
                  <div className="text-sm text-gray-600">Only premium members can view your profile</div>
                </div>
              </label>
            </div>
          </div>

          {/* Online Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2" />
              Online Presence
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Show Online Status</div>
                  <div className="text-sm text-gray-600">Let others see when you're online</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showOnlineStatus}
                  onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiLock className="w-5 h-5 mr-2" />
              Contact Preferences
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Allow Direct Contact</div>
                  <div className="text-sm text-gray-600">Let members contact you directly</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowDirectContact}
                  onChange={(e) => handleSettingChange('allowDirectContact', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Share Phone Number</div>
                  <div className="text-sm text-gray-600">Show your phone number to matched profiles</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sharePhoneNumber}
                  onChange={(e) => handleSettingChange('sharePhoneNumber', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Share Email Address</div>
                  <div className="text-sm text-gray-600">Show your email to matched profiles</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.shareEmail}
                  onChange={(e) => handleSettingChange('shareEmail', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          {/* Profile Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiEyeOff className="w-5 h-5 mr-2" />
              Profile Activity
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Show Profile Views</div>
                  <div className="text-sm text-gray-600">Let others see who viewed your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showProfileViews}
                  onChange={(e) => handleSettingChange('showProfileViews', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Hide from Search</div>
                  <div className="text-sm text-gray-600">Don't appear in search results</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hideFromSearch}
                  onChange={(e) => handleSettingChange('hideFromSearch', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Allow Profile Screenshots</div>
                  <div className="text-sm text-gray-600">Let others take screenshots of your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowProfileScreenshots}
                  onChange={(e) => handleSettingChange('allowProfileScreenshots', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Privacy Tips</h4>
          <ul className="space-y-2 text-blue-800">
            <li>• Review your privacy settings regularly</li>
            <li>• Be cautious about sharing personal contact information</li>
            <li>• Report any suspicious or inappropriate behavior</li>
            <li>• Consider upgrading to premium for enhanced privacy controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrivacySettingsPage;
