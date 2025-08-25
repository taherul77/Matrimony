'use client';

import { useState, useEffect } from 'react';
import { FiHeart, FiUsers, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';

interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message?: string;
  createdAt: string;
  sender: {
    name: string;
    email: string;
    age: number;
    gender: string;
    profile?: {
      photos: string[];
    };
  };
  receiver: {
    name: string;
    email: string;
    age: number;
    gender: string;
    profile?: {
      photos: string[];
    };
  };
}

const AdminInterests = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalInterests: 0,
    pendingInterests: 0,
    acceptedInterests: 0,
    rejectedInterests: 0,
  });

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await fetch('/api/interests');
      if (response.ok) {
        const data = await response.json();
        setInterests(data);
        
        // Calculate stats
        const totalInterests = data.length;
        const pendingInterests = data.filter((interest: Interest) => interest.status === 'pending').length;
        const acceptedInterests = data.filter((interest: Interest) => interest.status === 'accepted').length;
        const rejectedInterests = data.filter((interest: Interest) => interest.status === 'rejected').length;
        
        setStats({
          totalInterests,
          pendingInterests,
          acceptedInterests,
          rejectedInterests,
        });
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterests = interests.filter(interest => {
    return statusFilter === 'all' || interest.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="h-4 w-4" />;
      case 'accepted':
        return <FiCheck className="h-4 w-4" />;
      case 'rejected':
        return <FiX className="h-4 w-4" />;
      default:
        return <FiHeart className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
     
    );
  }

  return (

      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interest Management</h1>
          <p className="text-gray-600">Monitor and manage all user interests and connections.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Interests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInterests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiHeart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingInterests}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Accepted</p>
                <p className="text-3xl font-bold text-gray-900">{stats.acceptedInterests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rejectedInterests}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Interests Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">All Interests</h2>
                <p className="text-sm text-gray-600">View all interests sent between users</p>
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterests.map((interest) => (
                  <tr key={interest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {interest.sender.profile?.photos?.[0] ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={interest.sender.profile.photos[0]}
                              alt={interest.sender.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {interest.sender.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{interest.sender.name}</div>
                          <div className="text-sm text-gray-500">{interest.sender.age}y, {interest.sender.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {interest.receiver.profile?.photos?.[0] ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={interest.receiver.profile.photos[0]}
                              alt={interest.receiver.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {interest.receiver.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{interest.receiver.name}</div>
                          <div className="text-sm text-gray-500">{interest.receiver.age}y, {interest.receiver.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interest.status)}`}>
                        {getStatusIcon(interest.status)}
                        <span className="ml-1 capitalize">{interest.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {interest.message || 'No message'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(interest.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => window.open(`/profile/${interest.senderId}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <FiEye className="h-4 w-4 mr-1" />
                        View Sender
                      </button>
                      <button
                        onClick={() => window.open(`/profile/${interest.receiverId}`, '_blank')}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                      >
                        <FiEye className="h-4 w-4 mr-1" />
                        View Receiver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
   
  );
};

export default AdminInterests;
