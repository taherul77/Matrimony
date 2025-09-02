"use client";

import React from 'react';
import { FiX, FiCheck, FiStar, FiHeart, FiEye, FiLock, FiMessageSquare, FiUsers, FiCamera } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaCrown } from 'react-icons/fa';

interface PackageComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  currentPackage?: string;
}

interface PackageFeature {
  name: string;
  icon: React.ReactNode;
  free: boolean | string;
  silver: boolean | string;
  gold: boolean | string;
  platinum: boolean | string;
  vip: boolean | string;
}

const PackageComparison: React.FC<PackageComparisonProps> = ({ 
  isOpen, 
  onClose, 
  currentPackage = 'free' 
}) => {
  if (!isOpen) return null;

  const packages = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    {
      name: 'Silver',
      price: '₹999',
      period: 'per month',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Gold',
      price: '₹1,999',
      period: 'per month',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Platinum',
      price: '₹2,999',
      period: 'per month',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      name: 'VIP',
      price: '₹4,999',
      period: 'per month',
      color: 'pink',
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
      textColor: 'text-pink-600',
      borderColor: 'border-pink-200'
    }
  ];

  const features: PackageFeature[] = [
    {
      name: 'Profile Creation',
      icon: <FiUsers className="w-4 h-4" />,
      free: true,
      silver: true,
      gold: true,
      platinum: true,
      vip: true
    },
    {
      name: 'Photo Uploads',
      icon: <FiCamera className="w-4 h-4" />,
      free: '2 photos',
      silver: '5 photos',
      gold: '10 photos',
      platinum: '15 photos',
      vip: 'Unlimited'
    },
    {
      name: 'Daily Interests',
      icon: <FiHeart className="w-4 h-4" />,
      free: '3 per day',
      silver: '10 per day',
      gold: '25 per day',
      platinum: '50 per day',
      vip: 'Unlimited'
    },
    {
      name: 'Monthly Messages',
      icon: <FiMessageSquare className="w-4 h-4" />,
      free: 'Receive only',
      silver: '50 messages',
      gold: '150 messages',
      platinum: '300 messages',
      vip: 'Unlimited'
    },
    {
      name: 'View Contact Details',
      icon: <FiEye className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: '10 per month',
      platinum: '50 per month',
      vip: 'Unlimited'
    },
    {
      name: 'Direct Messaging',
      icon: <FiMessageSquare className="w-4 h-4" />,
      free: false,
      silver: 'Limited',
      gold: true,
      platinum: true,
      vip: true
    },
    {
      name: 'Advanced Search',
      icon: <FiStar className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: true,
      platinum: true,
      vip: true
    },
    {
      name: 'Profile Highlight',
      icon: <HiSparkles className="w-4 h-4" />,
      free: false,
      silver: true,
      gold: true,
      platinum: true,
      vip: true
    },
    {
      name: 'Featured Profile',
      icon: <FiStar className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: false,
      platinum: true,
      vip: true
    },
    {
      name: 'VIP Badge',
      icon: <FaCrown className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: false,
      platinum: false,
      vip: true
    },
    {
      name: 'Priority Support',
      icon: <FiStar className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: false,
      platinum: true,
      vip: true
    },
    {
      name: 'Personal Matchmaker',
      icon: <FiUsers className="w-4 h-4" />,
      free: false,
      silver: false,
      gold: false,
      platinum: false,
      vip: true
    }
  ];

  const renderFeatureValue = (value: boolean | string, packageName: string) => {
    if (value === true) {
      return <FiCheck className="w-5 h-5 text-green-500 mx-auto" />;
    }
    if (value === false) {
      return <FiX className="w-5 h-5 text-red-400 mx-auto" />;
    }
    return (
      <span className={`text-sm font-medium ${getPackageTextColor(packageName)}`}>
        {value}
      </span>
    );
  };

  const getPackageTextColor = (packageName: string) => {
    const pkg = packages.find(p => p.name.toLowerCase() === packageName);
    return pkg?.textColor || 'text-gray-600';
  };

  const getPackageBorder = (packageName: string) => {
    if (currentPackage.toLowerCase() === packageName.toLowerCase()) {
      return 'ring-2 ring-blue-500 ring-offset-2';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Perfect Plan</h2>
              <p className="text-blue-100">Compare features and find the package that's right for you</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Package Headers */}
            <div className="grid grid-cols-6 gap-4 mb-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
              </div>
              {packages.map((pkg) => (
                <div 
                  key={pkg.name}
                  className={`text-center p-4 rounded-xl ${pkg.bgColor} ${pkg.borderColor} border-2 ${getPackageBorder(pkg.name)}`}
                >
                  <div className="mb-3">
                    {pkg.name === 'VIP' && <FaCrown className="w-6 h-6 text-pink-500 mx-auto mb-2" />}
                    {pkg.name === 'Platinum' && <HiSparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />}
                    {pkg.name === 'Gold' && <FiStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />}
                    {pkg.name === 'Silver' && <FiStar className="w-6 h-6 text-blue-500 mx-auto mb-2" />}
                  </div>
                  <h4 className={`text-xl font-bold ${pkg.textColor} mb-1`}>{pkg.name}</h4>
                  <div className={`text-2xl font-bold ${pkg.textColor} mb-1`}>{pkg.price}</div>
                  <div className="text-sm text-gray-500">{pkg.period}</div>
                  {currentPackage.toLowerCase() === pkg.name.toLowerCase() && (
                    <div className="mt-2 bg-blue-500 text-white text-xs py-1 px-2 rounded-full">
                      Current Plan
                    </div>
                  )}
                  {currentPackage.toLowerCase() !== pkg.name.toLowerCase() && pkg.name !== 'Free' && (
                    <button className={`mt-2 w-full bg-gradient-to-r from-${pkg.color}-500 to-${pkg.color}-600 text-white text-sm py-2 px-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300`}>
                      Upgrade
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`grid grid-cols-6 gap-4 p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <span className="font-medium text-gray-800">{feature.name}</span>
                  </div>
                  <div className="text-center">
                    {renderFeatureValue(feature.free, 'free')}
                  </div>
                  <div className="text-center">
                    {renderFeatureValue(feature.silver, 'silver')}
                  </div>
                  <div className="text-center">
                    {renderFeatureValue(feature.gold, 'gold')}
                  </div>
                  <div className="text-center">
                    {renderFeatureValue(feature.platinum, 'platinum')}
                  </div>
                  <div className="text-center">
                    {renderFeatureValue(feature.vip, 'vip')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>• All plans include basic profile creation and browsing</p>
              <p>• Upgrade or downgrade anytime • Cancel subscription anytime</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageComparison;
