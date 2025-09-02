"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiStar, 
  FiUsers,
  FiCalendar,
  FiHeadphones,
  FiTrendingUp,
  FiHeart,
  FiMessageSquare,
  FiAward,
  FiTarget,
  FiClock,
  FiPhone
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

interface VIPStats {
  exclusiveMatches: number;
  personalSessions: number;
  prioritySupport: number;
  vipEvents: number;
  profileBoosts: number;
  successRate: number;
}

interface ExclusiveMatch {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  image: string;
  matchPercentage: number;
  curatedBy: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'webinar' | 'meetup' | 'consultation';
  attendees: number;
  maxAttendees: number;
}

const VIPDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VIPStats>({
    exclusiveMatches: 0,
    personalSessions: 0,
    prioritySupport: 0,
    vipEvents: 0,
    profileBoosts: 0,
    successRate: 0
  });
  const [exclusiveMatches, setExclusiveMatches] = useState<ExclusiveMatch[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    fetchVIPData();
  }, []);

  const fetchVIPData = async () => {
    try {
      setLoading(true);
      
      // Mock VIP stats
      const mockStats: VIPStats = {
        exclusiveMatches: 12,
        personalSessions: 3,
        prioritySupport: 5,
        vipEvents: 8,
        profileBoosts: 15,
        successRate: 94
      };

      // Mock exclusive matches
      const mockMatches: ExclusiveMatch[] = [
        {
          id: '1',
          name: 'Priya Sharma',
          age: 26,
          location: 'Mumbai, Maharashtra',
          occupation: 'Investment Banker',
          image: '/uploads/1755858552715_user2.jpg',
          matchPercentage: 97,
          curatedBy: 'Senior Matchmaker Sarah'
        },
        {
          id: '2',
          name: 'Anita Patel',
          age: 28,
          location: 'Ahmedabad, Gujarat',
          occupation: 'Cardiologist',
          image: '/uploads/1755863927941_user2.jpg',
          matchPercentage: 95,
          curatedBy: 'Elite Consultant Raj'
        },
        {
          id: '3',
          name: 'Kavya Singh',
          age: 25,
          location: 'Delhi, India',
          occupation: 'Management Consultant',
          image: '/uploads/1756105297051_user2.jpg',
          matchPercentage: 93,
          curatedBy: 'VIP Advisor Meera'
        }
      ];

      // Mock upcoming events
      const mockEvents: UpcomingEvent[] = [
        {
          id: '1',
          title: 'VIP Speed Dating Event',
          date: '2025-09-15',
          time: '18:00',
          type: 'meetup',
          attendees: 15,
          maxAttendees: 20
        },
        {
          id: '2',
          title: 'Personal Matchmaking Consultation',
          date: '2025-09-10',
          time: '14:00',
          type: 'consultation',
          attendees: 1,
          maxAttendees: 1
        },
        {
          id: '3',
          title: 'Building Meaningful Relationships Webinar',
          date: '2025-09-20',
          time: '16:00',
          type: 'webinar',
          attendees: 45,
          maxAttendees: 50
        }
      ];

      setStats(mockStats);
      setExclusiveMatches(mockMatches);
      setUpcomingEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching VIP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return <FiMessageSquare className="w-4 h-4" />;
      case 'meetup':
        return <FiUsers className="w-4 h-4" />;
      case 'consultation':
        return <FiPhone className="w-4 h-4" />;
      default:
        return <FiCalendar className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading VIP Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaCrown className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VIP Dashboard</h1>
              <p className="text-gray-600">Welcome to your exclusive matrimonial experience</p>
            </div>
          </div>
        </div>

        {/* VIP Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiTarget className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exclusive Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.exclusiveMatches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Personal Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.personalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiHeadphones className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Priority Support</p>
                <p className="text-2xl font-bold text-gray-900">{stats.prioritySupport}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">VIP Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vipEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Boosts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileBoosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-200">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FiAward className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exclusive Handpicked Matches */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FaCrown className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Handpicked Matches</h2>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {exclusiveMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={match.image}
                      alt={match.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{match.name}</h3>
                          <p className="text-sm text-gray-600">{match.age} years • {match.location}</p>
                          <p className="text-sm text-gray-600">{match.occupation}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {match.matchPercentage}% Match
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-yellow-600">
                          Curated by {match.curatedBy}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                          <FiHeart className="w-3 h-3 mr-1" />
                          Interest
                        </button>
                        <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                          <FiMessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming VIP Events */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Upcoming VIP Events</h2>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <FiClock className="w-3 h-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center">
                          <FiUsers className="w-3 h-3 mr-1" />
                          {event.attendees}/{event.maxAttendees} attendees
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                          {event.type === 'consultation' ? 'Join Session' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIP Services Quick Access */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3">
              <FaCrown className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Personal Matchmaker</h3>
                <p className="text-sm opacity-90">Get expert guidance</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Schedule Session
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3">
              <FiHeadphones className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Priority Support</h3>
                <p className="text-sm opacity-90">24/7 assistance</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Contact Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3">
              <FiUsers className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Exclusive Events</h3>
                <p className="text-sm opacity-90">VIP meetups & webinars</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Browse Events
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3">
              <FiTrendingUp className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Profile Boost</h3>
                <p className="text-sm opacity-90">Increase visibility</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Boost Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPDashboardPage;
