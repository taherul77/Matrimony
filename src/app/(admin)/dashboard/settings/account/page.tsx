"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiTrash2, FiEdit3 } from 'react-icons/fi';

interface AccountSettings {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

const DashboardAccountSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AccountSettings>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchAccountSettings = async (userId: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/me`);
        
        if (response.ok) {
          const data = await response.json();
          setSettings({
            email: data.user.email || '',
            phone: data.user.phone || '',
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : '',
            gender: data.user.gender || ''
          });
        }
      } catch (error) {
        console.error('Error fetching account settings:', error);
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
          fetchAccountSettings(user.id);
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
      const response = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: settings.firstName,
          lastName: settings.lastName,
          phone: settings.phone,
          dateOfBirth: settings.dateOfBirth,
          gender: settings.gender
        }),
      });

      if (response.ok) {
        alert('Account settings saved successfully!');
      } else {
        alert('Failed to save account settings');
      }
    } catch (error) {
      console.error('Error saving account settings:', error);
      alert('Error saving account settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUserId) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof AccountSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to manage account settings</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading account settings...</div>
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
              <FiUser className="w-8 h-8 mr-3 text-blue-600" />
              Account Settings
            </h1>
            <p className="text-gray-600">Manage your personal information and security</p>
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
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiEdit3 className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={settings.firstName}
                  onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={settings.lastName}
                  onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={settings.dateOfBirth}
                  onChange={(e) => handleSettingChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={settings.gender}
                  onChange={(e) => handleSettingChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiMail className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiLock className="w-5 h-5 mr-2" />
                Password & Security
              </h3>
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change Password
                </button>
              )}
            </div>

            {isEditingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">••••••••••••</p>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <FiTrash2 className="w-5 h-5 mr-2" />
              Danger Zone
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
              <p className="text-red-700 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                    alert('Account deletion feature will be implemented.');
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccountSettingsPage;
