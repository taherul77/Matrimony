"use client";

import React, { useState, useEffect } from 'react';
import { PackageComparison } from '@/components';
import { FiCheck, FiX, FiStar } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isPopular?: boolean;
}

interface UserSubscription {
  id: string;
  package: Package;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const DashboardPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage/cookies
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
          fetchPackages();
          fetchCurrentSubscription(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchCurrentSubscription = async (userId: string) => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (packageId: string) => {
    if (!currentUserId) return;

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId
        }),
      });

      if (response.ok) {
        alert('Plan selected successfully!');
        fetchCurrentSubscription(currentUserId);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to select plan');
      }
    } catch (error) {
      console.error('Failed to select plan:', error);
      alert('Failed to select plan');
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">Please log in to view packages</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock premium features and find your perfect match with our carefully designed packages
          </p>
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Current Plan</h3>
                <p className="text-blue-700">
                  {currentSubscription.package.name} - Active until {new Date(currentSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                pkg.name.toLowerCase() === 'gold' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {pkg.name.toLowerCase() === 'gold' && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-center py-2">
                  <span className="text-sm font-semibold text-yellow-900">MOST POPULAR</span>
                </div>
              )}
              
              <div className={`p-6 ${pkg.name.toLowerCase() === 'gold' ? 'pt-12' : ''}`}>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    {pkg.name.toLowerCase() === 'vip' || pkg.name.toLowerCase() === 'elite' ? (
                      <FaCrown className="w-8 h-8 text-yellow-500" />
                    ) : (
                      <FiStar className="w-8 h-8 text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">₹{pkg.price}</span>
                    {pkg.price > 0 && (
                      <span className="text-gray-600">/{pkg.duration} days</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.slice(0, 6).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.startsWith('✅') ? (
                        <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : feature.startsWith('🚫') ? (
                        <FiX className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700">
                        {feature.replace(/^[✅🚫⚪💰🔴🔵🟡]\s*/, '')}
                      </span>
                    </li>
                  ))}
                  {pkg.features.length > 6 && (
                    <li className="text-sm text-gray-500 text-center">
                      +{pkg.features.length - 6} more features
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSelectPlan(pkg.id)}
                  disabled={currentSubscription?.package.id === pkg.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    currentSubscription?.package.id === pkg.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : pkg.name.toLowerCase() === 'gold'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : pkg.name.toLowerCase() === 'vip' || pkg.name.toLowerCase() === 'elite'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentSubscription?.package.id === pkg.id
                    ? 'Current Plan'
                    : pkg.price === 0
                    ? 'Get Started'
                    : 'Upgrade Now'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Compare All Features</h3>
            <p className="text-gray-600">
              All packages include basic matrimonial features with premium tiers offering enhanced capabilities.
            </p>
          </div>
        </div>

        {/* FAQs or Support Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help you find the perfect plan for your needs.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPackagesPage;
