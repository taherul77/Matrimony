"use client";

import React, { useState, useEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { FiUser, FiCalendar, FiPhone, FiVideo, FiMessageSquare, FiStar, FiCheckCircle, FiClock, FiHeart } from 'react-icons/fi';
import Image from 'next/image';

interface Matchmaker {
  id: string;
  name: string;
  photo: string;
  title: string;
  experience: number;
  specialization: string[];
  rating: number;
  totalMatches: number;
  successRate: number;
  languages: string[];
  bio: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  isOnline: boolean;
}

interface MatchmakerSession {
  id: string;
  matchmakerId: string;
  date: string;
  time: string;
  type: 'consultation' | 'profile-review' | 'match-discussion';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const DashboardVipMatchmakerPage: React.FC = () => {
  const [matchmakers, setMatchmakers] = useState<Matchmaker[]>([]);
  const [sessions, setSessions] = useState<MatchmakerSession[]>([]);
  const [selectedMatchmaker, setSelectedMatchmaker] = useState<Matchmaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'profile-review' | 'match-discussion',
    notes: ''
  });

  useEffect(() => {
    const fetchMatchmakerData = async () => {
      try {
        setLoading(true);
        
        // Fetch available matchmakers
        const matchmakersResponse = await fetch('/api/vip/matchmakers');
        if (matchmakersResponse.ok) {
          const matchmakersData = await matchmakersResponse.json();
          setMatchmakers(matchmakersData.matchmakers || []);
        }

        // Fetch user's matchmaker sessions
        const sessionsResponse = await fetch('/api/vip/matchmaker-sessions');
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData.sessions || []);
        }
      } catch (error) {
        console.error('Error fetching matchmaker data:', error);
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
          fetchMatchmakerData();
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const handleBookSession = async () => {
    if (!selectedMatchmaker || !currentUserId) return;

    try {
      const response = await fetch('/api/vip/matchmaker-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchmakerId: selectedMatchmaker.id,
          userId: currentUserId,
          date: bookingData.date,
          time: bookingData.time,
          type: bookingData.type,
          notes: bookingData.notes
        }),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions(prev => [...prev, newSession.session]);
        setShowBookingModal(false);
        setBookingData({ date: '', time: '', type: 'consultation', notes: '' });
        alert('Session booked successfully!');
      } else {
        alert('Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Error booking session');
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to access VIP matchmaker services</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading VIP matchmaker services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaCrown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">VIP Matchmaker Services</h1>
          </div>
          <p className="text-center text-gray-600">
            Work with our expert matchmakers to find your perfect life partner
          </p>
          <div className="text-center mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <FaCrown className="w-4 h-4 mr-1" />
              VIP Exclusive Service
            </span>
          </div>
        </div>

        {/* Service Overview */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">What Our Matchmakers Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <FiUser className="w-5 h-5 mr-2" />
              <span>Personalized profile optimization</span>
            </div>
            <div className="flex items-center">
              <FiHeart className="w-5 h-5 mr-2" />
              <span>Curated match recommendations</span>
            </div>
            <div className="flex items-center">
              <FiMessageSquare className="w-5 h-5 mr-2" />
              <span>Dating strategy consultation</span>
            </div>
            <div className="flex items-center">
              <FiVideo className="w-5 h-5 mr-2" />
              <span>Virtual coaching sessions</span>
            </div>
            <div className="flex items-center">
              <FiStar className="w-5 h-5 mr-2" />
              <span>Relationship guidance</span>
            </div>
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 mr-2" />
              <span>Success tracking & feedback</span>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {sessions.filter(s => s.status === 'scheduled').length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FiCalendar className="w-5 h-5 mr-2" />
              Your Upcoming Sessions
            </h2>
            <div className="space-y-4">
              {sessions.filter(s => s.status === 'scheduled').map((session) => {
                const matchmaker = matchmakers.find(m => m.id === session.matchmakerId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      {matchmaker && (
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={matchmaker.photo}
                            alt={matchmaker.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {session.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} with {matchmaker?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                        <FiVideo className="w-4 h-4 mr-2" />
                        Join Call
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Matchmakers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Expert Matchmakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchmakers.map((matchmaker) => (
              <div
                key={matchmaker.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Matchmaker Photo */}
                <div className="relative h-48">
                  <Image
                    src={matchmaker.photo}
                    alt={matchmaker.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {matchmaker.isOnline ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Online
                      </span>
                    ) : (
                      <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Offline
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <FaCrown className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>

                {/* Matchmaker Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{matchmaker.name}</h3>
                    <p className="text-gray-600">{matchmaker.title}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{matchmaker.experience}</div>
                      <div className="text-xs text-gray-600">Years Exp.</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{matchmaker.totalMatches}</div>
                      <div className="text-xs text-gray-600">Matches</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-600">{matchmaker.successRate}%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(matchmaker.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({matchmaker.rating})</span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Specialization</div>
                    <div className="flex flex-wrap gap-1">
                      {matchmaker.specialization.slice(0, 2).map((spec, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                      {matchmaker.specialization.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{matchmaker.specialization.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Languages</div>
                    <div className="text-sm text-gray-600">
                      {matchmaker.languages.join(', ')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedMatchmaker(matchmaker)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMatchmaker(matchmaker);
                        setShowBookingModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-colors"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiClock className="w-5 h-5 mr-2" />
            Session History
          </h2>
          {sessions.filter(s => s.status === 'completed').length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No completed sessions yet</p>
              <p className="text-sm text-gray-500">Book your first session to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.filter(s => s.status === 'completed').map((session) => {
                const matchmaker = matchmakers.find(m => m.id === session.matchmakerId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {matchmaker && (
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={matchmaker.photo}
                            alt={matchmaker.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {session.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} with {matchmaker?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedMatchmaker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Book Session</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={selectedMatchmaker.photo}
                      alt={selectedMatchmaker.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedMatchmaker.name}</div>
                    <div className="text-sm text-gray-600">{selectedMatchmaker.title}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select
                    value={bookingData.type}
                    onChange={(e) => setBookingData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="consultation">Initial Consultation</option>
                    <option value="profile-review">Profile Review</option>
                    <option value="match-discussion">Match Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    {selectedMatchmaker.availability.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific topics you'd like to discuss..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookSession}
                  disabled={!bookingData.date || !bookingData.time}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Matchmaker Profile Modal */}
        {selectedMatchmaker && !showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Matchmaker Profile</h2>
                  <button
                    onClick={() => setSelectedMatchmaker(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                    <Image
                      src={selectedMatchmaker.photo}
                      alt={selectedMatchmaker.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedMatchmaker.name}</h3>
                    <p className="text-gray-600">{selectedMatchmaker.title}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedMatchmaker.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({selectedMatchmaker.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{selectedMatchmaker.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatchmaker.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-600">{selectedMatchmaker.experience} years</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
                      <p className="text-gray-600">{selectedMatchmaker.successRate}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                    <p className="text-gray-600">{selectedMatchmaker.languages.join(', ')}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Days: </span>
                        <span className="text-gray-600">{selectedMatchmaker.availability.days.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Times: </span>
                        <span className="text-gray-600">{selectedMatchmaker.availability.timeSlots.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setSelectedMatchmaker(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-colors flex items-center justify-center"
                  >
                    <FiCalendar className="w-5 h-5 mr-2" />
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardVipMatchmakerPage;
