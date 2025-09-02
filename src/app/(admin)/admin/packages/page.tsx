"use client";

import React, { useState, useEffect } from 'react';
import { FiPackage, FiEdit2, FiTrash2, FiPlus, FiDollarSign, FiUsers, FiCheck, FiX } from 'react-icons/fi';
import Modal from '@/components/Modal';

interface Package {
  id: string;
  name: string;
  tier: 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limitations: {
    profileViews: number;
    contactsPerMonth: number;
    messagesPerDay: number;
    searchFilters: number;
  };
  popular: boolean;
  active: boolean;
  subscribers: number;
  revenue: number;
  description: string;
}

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Package>>({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Mock data fallback
      const mockPackages: Package[] = [
        {
          id: '1',
          name: 'Free Basic',
          tier: 'FREE',
          monthlyPrice: 0,
          yearlyPrice: 0,
          description: 'Basic matrimonial features to get started',
          features: [
            'Create profile',
            'Basic search',
            'View limited profiles',
            'Basic matching'
          ],
          limitations: {
            profileViews: 5,
            contactsPerMonth: 2,
            messagesPerDay: 1,
            searchFilters: 2
          },
          popular: false,
          active: true,
          subscribers: 1250,
          revenue: 0
        },
        {
          id: '2',
          name: 'Silver',
          tier: 'SILVER',
          monthlyPrice: 500,
          yearlyPrice: 5000,
          description: 'Enhanced features for serious seekers',
          features: [
            'All Free features',
            'Advanced search filters',
            'See who viewed your profile',
            'Send unlimited messages',
            'Priority customer support'
          ],
          limitations: {
            profileViews: 50,
            contactsPerMonth: 10,
            messagesPerDay: 20,
            searchFilters: 8
          },
          popular: false,
          active: true,
          subscribers: 890,
          revenue: 445000
        },
        {
          id: '3',
          name: 'Gold',
          tier: 'GOLD',
          monthlyPrice: 1000,
          yearlyPrice: 10000,
          description: 'Most popular choice with premium features',
          features: [
            'All Silver features',
            'Personality compatibility matching',
            'Direct contact information',
            'Profile highlighting',
            'Advanced privacy controls',
            'Video call integration'
          ],
          limitations: {
            profileViews: 150,
            contactsPerMonth: 25,
            messagesPerDay: 50,
            searchFilters: 15
          },
          popular: true,
          active: true,
          subscribers: 1285,
          revenue: 1285000
        },
        {
          id: '4',
          name: 'Platinum',
          tier: 'PLATINUM',
          monthlyPrice: 2000,
          yearlyPrice: 20000,
          description: 'Premium experience with exclusive benefits',
          features: [
            'All Gold features',
            'Personal matchmaker assistance',
            'Background verification',
            'Exclusive events access',
            'Priority profile placement',
            'Relationship coaching sessions'
          ],
          limitations: {
            profileViews: 300,
            contactsPerMonth: 50,
            messagesPerDay: 100,
            searchFilters: 25
          },
          popular: false,
          active: true,
          subscribers: 300,
          revenue: 600000
        },
        {
          id: '5',
          name: 'VIP Elite',
          tier: 'VIP',
          monthlyPrice: 5000,
          yearlyPrice: 50000,
          description: 'Ultimate matrimonial experience with concierge service',
          features: [
            'All Platinum features',
            'Dedicated relationship manager',
            'Custom matchmaking events',
            'Priority verification',
            'Unlimited everything',
            '24/7 concierge support',
            'Family compatibility analysis'
          ],
          limitations: {
            profileViews: -1, // Unlimited
            contactsPerMonth: -1,
            messagesPerDay: -1,
            searchFilters: -1
          },
          popular: false,
          active: true,
          subscribers: 56,
          revenue: 280000
        }
      ];
      setPackages(mockPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsEditing(false);
    setFormData({
      name: '',
      tier: 'SILVER',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: '',
      features: [],
      limitations: {
        profileViews: 0,
        contactsPerMonth: 0,
        messagesPerDay: 0,
        searchFilters: 0
      },
      popular: false,
      active: true
    });
    setShowModal(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditing(true);
    setFormData(pkg);
    setShowModal(true);
  };

  const handleSavePackage = async () => {
    try {
      if (isEditing && selectedPackage) {
        // Update existing package
        const response = await fetch(`/api/packages/${selectedPackage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setPackages(prev => prev.map(p => 
            p.id === selectedPackage.id 
              ? { ...p, ...formData } as Package
              : p
          ));
        }
      } else {
        // Add new package
        const response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newPackage: Package = {
            ...formData,
            id: Date.now().toString(),
            subscribers: 0,
            revenue: 0
          } as Package;
          setPackages(prev => [...prev, newPackage]);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving package:', error);
      // Fallback to local state update
      if (isEditing && selectedPackage) {
        setPackages(prev => prev.map(p => 
          p.id === selectedPackage.id 
            ? { ...p, ...formData } as Package
            : p
        ));
      } else {
        const newPackage: Package = {
          ...formData,
          id: Date.now().toString(),
          subscribers: 0,
          revenue: 0
        } as Package;
        setPackages(prev => [...prev, newPackage]);
      }
      setShowModal(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`/api/packages/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPackages(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        // Fallback to local state update
        setPackages(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  const togglePackageStatus = async (id: string) => {
    try {
      const packageToUpdate = packages.find(p => p.id === id);
      if (!packageToUpdate) return;

      const response = await fetch(`/api/packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !packageToUpdate.active }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(p => 
          p.id === id 
            ? { ...p, active: !p.active }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling package status:', error);
      // Fallback to local state update
      setPackages(prev => prev.map(p => 
        p.id === id 
          ? { ...p, active: !p.active }
          : p
      ));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTierColor = (tier: string) => {
    const colors = {
      FREE: 'bg-gray-100 text-gray-700',
      SILVER: 'bg-gray-100 text-gray-700',
      GOLD: 'bg-yellow-100 text-yellow-700',
      PLATINUM: 'bg-purple-100 text-purple-700',
      VIP: 'bg-red-100 text-red-700'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiPackage className="w-8 h-8 mr-3" />
                Package Management
              </h1>
              <p className="text-gray-600 mt-2">Manage subscription packages and pricing</p>
            </div>
            <button
              onClick={handleAddPackage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Package
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Packages</h3>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                <p className="text-sm text-gray-600">{packages.filter(p => p.active).length} active</p>
              </div>
              <FiPackage className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Subscribers</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.reduce((sum, pkg) => sum + pkg.subscribers, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Across all packages</p>
              </div>
              <FiUsers className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(packages.reduce((sum, pkg) => sum + pkg.revenue, 0))}
                </p>
                <p className="text-sm text-gray-600">Current month</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Popular Package</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.find(p => p.popular)?.name || 'Gold'}
                </p>
                <p className="text-sm text-gray-600">Most subscribed</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-lg">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}`}>
              {pkg.popular && (
                <div className="bg-yellow-400 text-yellow-900 text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTierColor(pkg.tier)}`}>
                      {pkg.tier}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePackageStatus(pkg.id)}
                      className={`p-2 rounded-lg ${pkg.active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      {pkg.active ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {pkg.monthlyPrice === 0 ? 'Free' : formatCurrency(pkg.monthlyPrice)}
                    </span>
                    {pkg.monthlyPrice > 0 && <span className="text-gray-500 ml-1">/month</span>}
                  </div>
                  {pkg.yearlyPrice > 0 && (
                    <div className="text-sm text-gray-600">
                      {formatCurrency(pkg.yearlyPrice)}/year
                      <span className="text-green-600 ml-1">
                        (Save {Math.round((1 - pkg.yearlyPrice / (pkg.monthlyPrice * 12)) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-900">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-blue-600 text-xs">+{pkg.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{pkg.subscribers}</div>
                    <div className="text-xs text-gray-500">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {pkg.revenue === 0 ? '₹0' : formatCurrency(pkg.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Package Modal */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={isEditing ? 'Edit Package' : 'Add New Package'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter package name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select
                  value={formData.tier || 'SILVER'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as Package['tier'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="FREE">Free</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="PLATINUM">Platinum</option>
                  <option value="VIP">VIP Elite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (₹)</label>
                <input
                  type="number"
                  value={formData.yearlyPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearlyPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Package description"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.popular || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
                  className="mr-2"
                />
                Popular Package
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Package' : 'Add Package'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PackagesPage;
