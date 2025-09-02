"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiUsers, 
  FiCalendar, 
  FiHeart, 
  FiStar, 
  FiZap, 
  FiHeadphones, 
  FiShield, 
  FiEye,
  FiAward,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';

interface VipDashboardProps {
  userId?: string;
}

interface VipServices {
  personalMatchmaker: boolean;
  handpickedMatches: any[];
  prioritySupport: boolean;
  supportRequests: any[];
  eventAccess: boolean;
  upcomingEvents: any[];
  profilePromotion: boolean;
  privacyControl: boolean;
}

const VipDashboard: React.FC<VipDashboardProps> = ({ userId }) => {
  const [vipServices, setVipServices] = useState<VipServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user if userId not provided
  const fetchCurrentUser = useCallback(async () => {
    if (userId) return userId;
    
    try {
      const response = await fetch('/api/me');
      const data = await response.json();
      if (response.ok && data.user) {
        setCurrentUser(data.user);
        return data.user.id;
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
    return null;
  }, [userId]);

  const fetchVipServices = useCallback(async () => {
    try {
      setLoading(true);
      const userIdToUse = await fetchCurrentUser();
      if (!userIdToUse) {
        setError('Unable to identify user');
        return;
      }
      
      const response = await fetch(`/api/vip/services?userId=${userIdToUse}`);
      const data = await response.json();
      
      if (response.ok) {
        setVipServices(data.vipServices);
      } else {
        setError(data.error || 'Failed to load VIP services');
      }
    } catch (err) {
      setError('Failed to load VIP services');
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchVipServices();
  }, [fetchVipServices]);

  const requestService = async (serviceType: string, details?: any) => {
    try {
      const response = await fetch('/api/vip/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          serviceType,
          details
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchVipServices(); // Refresh data
      } else {
        alert(data.error || 'Failed to request service');
      }
    } catch (err) {
      alert('Failed to request service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading VIP Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchVipServices}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* VIP Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FaCrown className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">VIP Dashboard</h1>
              <HiSparkles className="w-12 h-12 text-yellow-300 ml-4" />
            </div>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              Premium Exclusive Services & Features
            </p>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <FiAward className="w-5 h-5 mr-2" />
              <span className="font-medium">Elite Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Handpicked Matches</h3>
                <p className="text-3xl font-bold text-purple-600">{vipServices?.handpickedMatches?.length || 0}</p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Exclusive Events</h3>
                <p className="text-3xl font-bold text-pink-600">{vipServices?.upcomingEvents?.length || 0}</p>
              </div>
              <FiCalendar className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Support Requests</h3>
                <p className="text-3xl font-bold text-red-600">{vipServices?.supportRequests?.length || 0}</p>
              </div>
              <FiHeadphones className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Profile Views</h3>
                <p className="text-3xl font-bold text-yellow-600">2.5x</p>
                <p className="text-sm text-gray-500">Higher than average</p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* VIP Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Matchmaker */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Personal Matchmaker</h3>
                <p className="text-gray-600">Dedicated relationship expert</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Get personalized assistance from our expert matchmakers who understand your preferences and find compatible matches tailored just for you.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => requestService('personal_matchmaker_request', 
                  'I would like to discuss my preferences and get personalized match recommendations.'
                )}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Request Matchmaker Consultation
              </button>
              
              {vipServices?.handpickedMatches && vipServices.handpickedMatches.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Recent Handpicked Matches</h4>
                  <div className="space-y-2">
                    {vipServices.handpickedMatches.slice(0, 3).map((match, index) => (
                      <div key={index} className="text-sm text-purple-700">
                        • Match suggested {new Date(match.createdAt).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exclusive Events */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <FiCalendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Exclusive Events</h3>
                <p className="text-gray-600">VIP-only matchmaking events</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Access exclusive matchmaking events, webinars, and social gatherings designed for VIP members to meet like-minded individuals.
            </p>
            
            <div className="space-y-4">
              {vipServices?.upcomingEvents && vipServices.upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {vipServices.upcomingEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-800">{event.title}</h4>
                      <p className="text-sm text-pink-600">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <button
                        onClick={() => requestService('event_registration', { eventId: event.id })}
                        className="mt-2 text-pink-600 text-sm font-medium hover:text-pink-700"
                      >
                        Register Now →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-pink-700">No upcoming events at the moment. We'll notify you when new exclusive events are available!</p>
                </div>
              )}
            </div>
          </div>

          {/* Priority Support */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FiHeadphones className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">24/7 Priority Support</h3>
                <p className="text-gray-600">Instant assistance when you need it</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Get immediate priority support with dedicated phone line, live chat, and email support available 24/7.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => requestService('priority_support_request', 
                  'I need immediate assistance with my account.'
                )}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Request Priority Support
              </button>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-red-600">Phone Support</div>
                  <div className="text-gray-600">+1-800-VIP-HELP</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">Response Time</div>
                  <div className="text-gray-600">&lt; 5 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Boost & Promotion */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-100">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FiZap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Profile Promotion</h3>
                <p className="text-gray-600">Maximum visibility & exposure</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Your profile gets promoted across our platform newsletters, featured in ads, and boosted weekly for maximum visibility.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => requestService('profile_boost_request')}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Boost Profile Now
              </button>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Active Promotions</h4>
                <div className="space-y-2 text-sm text-yellow-700">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-2" />
                    Featured in search results
                  </div>
                  <div className="flex items-center">
                    <FiEye className="w-4 h-4 mr-2" />
                    Newsletter promotion (monthly)
                  </div>
                  <div className="flex items-center">
                    <FiZap className="w-4 h-4 mr-2" />
                    Weekly profile boost
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security Features */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <FiShield className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Complete Privacy Control</h3>
              <p className="text-gray-600">Advanced privacy and security features</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FiEye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Private Browsing</h4>
              <p className="text-sm text-gray-600">Browse profiles without leaving traces</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FiShield className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Profile Security</h4>
              <p className="text-sm text-gray-600">Enhanced verification and protection</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FiClock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Online Status Control</h4>
              <p className="text-sm text-gray-600">Control when others see you online</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Need Help?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors">
              Contact Your Matchmaker
            </button>
            <button className="bg-pink-100 text-pink-700 px-6 py-3 rounded-lg hover:bg-pink-200 transition-colors">
              View Compatibility Reports
            </button>
            <button className="bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors">
              Priority Support Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipDashboard;
