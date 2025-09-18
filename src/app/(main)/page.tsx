'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import ProfileCard from '@/components/ProfileCard';
import Link from 'next/link';
/* eslint-disable @next/next/no-img-element */
import { FiHeart, FiUsers, FiShield, FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const features = [
  {
    icon: FiHeart,
    title: 'Smart Matching',
    description: 'Advanced algorithms to find your perfect match based on compatibility, values, and preferences.'
  },
  {
    icon: FiShield,
    title: 'Verified Profiles',
    description: 'All profiles are manually verified to ensure authenticity and build trust in our community.'
  },
  {
    icon: FiUsers,
    title: 'Large Community',
    description: 'Join millions of people who have found their life partners through our platform.'
  },
  {
    icon: FiStar,
    title: 'Premium Features',
    description: 'Access advanced search filters, unlimited messaging, and priority support with premium membership.'
  }
];

const stats = [
  { number: '10M+', label: 'Active Users' },
  { number: '50K+', label: 'Success Stories' },
  { number: '95%', label: 'Success Rate' },
  { number: '24/7', label: 'Support' }
];

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check login status via /api/me (server-side, works with HttpOnly cookies)
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
        setUser(data.user || null);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
    }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch from database
        const response = await fetch('/api/profiles?limit=9');
        if (response.ok) {
          const data = await response.json();
          setProfiles(data.profiles || []);
        } else {
          setError('Failed to load profiles');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const seedDatabase = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seed', { method: 'POST' });
      if (response.ok) {
        // Refetch profiles after seeding
        const profilesResponse = await fetch('/api/profiles?limit=9');
        if (profilesResponse.ok) {
          const data = await profilesResponse.json();
          setProfiles(data.profiles || []);
        }
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
  
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
              Find Your
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Perfect Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join millions of people who have found their life partners through our trusted matrimonial platform. 
              Start your journey to forever love today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <Link href="/profile">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300">
                    Start Your Journey
                  </button>
                </Link>
              )}
              <Link href="/search">
                <button className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 hover:scale-105 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the most comprehensive and trusted platform for finding your life partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Profiles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing people who are looking for their perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 9 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="w-full h-64 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))
            ) : profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <FiUsers className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl mb-2">No profiles found</p>
                  <p className="mb-6">Get started by adding some demo profiles to the database</p>
                </div>
                <button
                  onClick={seedDatabase}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Add Demo Profiles
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/search">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300">
                View More Profiles
              </button>
            </Link>
          </div>
        </div>
      </section>


      <section className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from couples who found love on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1].map((story) => (
              <div key={story} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <FiHeart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Priya & Rahul</h3>
                    <p className="text-gray-600">Married 2 years ago</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "We found each other on this platform and instantly connected. Our values and goals aligned perfectly. 
                  Today we're happily married and grateful for this amazing platform."
                </p>
                <div className="flex items-center text-pink-500">
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verified Success Story</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of people who have found their life partners. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transform hover:-translate-y-1 transition-all duration-300">
                Create Free Profile
              </button>
            </Link>
            <Link href="/search">
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-pink-500 hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Matrimony</h3>
              <p className="text-gray-300">
                Find your perfect match with our trusted matrimonial platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Matrimony. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
