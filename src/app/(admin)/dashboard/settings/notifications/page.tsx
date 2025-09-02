"use client";

import React, { useState, useEffect } from 'react';
import { FiBell, FiMail, FiSmartphone, FiMessageSquare, FiHeart, FiEye, FiUserPlus } from 'react-icons/fi';

interface NotificationSettings {
  emailNotifications: {
    newMatches: boolean;
    newMessages: boolean;
    profileViews: boolean;
    interestReceived: boolean;
    interestAccepted: boolean;
    packageExpiry: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  pushNotifications: {
    newMatches: boolean;
    newMessages: boolean;
    profileViews: boolean;
    interestReceived: boolean;
    interestAccepted: boolean;
    packageExpiry: boolean;
  };
  smsNotifications: {
    newMatches: boolean;
    newMessages: boolean;
    securityAlerts: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const DashboardNotificationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      newMatches: true,
      newMessages: true,
      profileViews: true,
      interestReceived: true,
      interestAccepted: true,
      packageExpiry: true,
      promotions: false,
      newsletter: false,
    },
    pushNotifications: {
      newMatches: true,
      newMessages: true,
      profileViews: false,
      interestReceived: true,
      interestAccepted: true,
      packageExpiry: true,
    },
    smsNotifications: {
      newMatches: false,
      newMessages: false,
      securityAlerts: true,
    },
    frequency: 'instant',
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotificationSettings = async (userId: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/notification-settings?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setSettings(prevSettings => data.settings || prevSettings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
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
          fetchNotificationSettings(user.id);
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
      const response = await fetch('/api/notification-settings', {
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
        alert('Notification settings saved successfully!');
      } else {
        alert('Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Error saving notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailNotificationChange = (key: keyof typeof settings.emailNotifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value
      }
    }));
  };

  const handlePushNotificationChange = (key: keyof typeof settings.pushNotifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value
      }
    }));
  };

  const handleSmsNotificationChange = (key: keyof typeof settings.smsNotifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      smsNotifications: {
        ...prev.smsNotifications,
        [key]: value
      }
    }));
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to manage notification settings</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading notification settings...</div>
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
              <FiBell className="w-8 h-8 mr-3 text-blue-600" />
              Notification Settings
            </h1>
            <p className="text-gray-600">Choose how you want to be notified about important updates</p>
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
          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiMail className="w-5 h-5 mr-2" />
              Email Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.emailNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {key === 'newMatches' && <FiHeart className="w-4 h-4 mr-2 text-pink-500" />}
                    {key === 'newMessages' && <FiMessageSquare className="w-4 h-4 mr-2 text-blue-500" />}
                    {key === 'profileViews' && <FiEye className="w-4 h-4 mr-2 text-green-500" />}
                    {key === 'interestReceived' && <FiUserPlus className="w-4 h-4 mr-2 text-purple-500" />}
                    {key === 'interestAccepted' && <FiHeart className="w-4 h-4 mr-2 text-red-500" />}
                    <div>
                      <div className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-600">
                        {key === 'newMatches' && 'Get notified when you have new potential matches'}
                        {key === 'newMessages' && 'Receive alerts for new messages from other members'}
                        {key === 'profileViews' && 'Know when someone views your profile'}
                        {key === 'interestReceived' && 'Be alerted when someone shows interest in you'}
                        {key === 'interestAccepted' && 'Get notified when your interest is accepted'}
                        {key === 'packageExpiry' && 'Reminders about your subscription expiring'}
                        {key === 'promotions' && 'Special offers and promotional content'}
                        {key === 'newsletter' && 'Monthly newsletter with tips and updates'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleEmailNotificationChange(key as keyof typeof settings.emailNotifications, e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiSmartphone className="w-5 h-5 mr-2" />
              Push Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.pushNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {key === 'newMatches' && <FiHeart className="w-4 h-4 mr-2 text-pink-500" />}
                    {key === 'newMessages' && <FiMessageSquare className="w-4 h-4 mr-2 text-blue-500" />}
                    {key === 'profileViews' && <FiEye className="w-4 h-4 mr-2 text-green-500" />}
                    {key === 'interestReceived' && <FiUserPlus className="w-4 h-4 mr-2 text-purple-500" />}
                    {key === 'interestAccepted' && <FiHeart className="w-4 h-4 mr-2 text-red-500" />}
                    <div>
                      <div className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-600">
                        Instant notifications on your device
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePushNotificationChange(key as keyof typeof settings.pushNotifications, e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiSmartphone className="w-5 h-5 mr-2" />
              SMS Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.smsNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-600">
                      {key === 'newMatches' && 'SMS alerts for new matches'}
                      {key === 'newMessages' && 'Text notifications for new messages'}
                      {key === 'securityAlerts' && 'Important security-related notifications'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSmsNotificationChange(key as keyof typeof settings.smsNotifications, e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Notification Frequency */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="instant"
                  checked={settings.frequency === 'instant'}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Instant</div>
                  <div className="text-sm text-gray-600">Receive notifications immediately</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={settings.frequency === 'daily'}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Daily Digest</div>
                  <div className="text-sm text-gray-600">Get a summary once per day</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value="weekly"
                  checked={settings.frequency === 'weekly'}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Weekly Summary</div>
                  <div className="text-sm text-gray-600">Receive updates once per week</div>
                </div>
              </label>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Enable Quiet Hours</div>
                  <div className="text-sm text-gray-600">Don't send notifications during specified hours</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5"
                />
              </label>
              
              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietHours.startTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, startTime: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietHours.endTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, endTime: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotificationSettingsPage;
