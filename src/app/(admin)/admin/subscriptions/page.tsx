"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiCreditCard, 
  FiUsers, 
  FiDollarSign, 
  FiCalendar,
  FiTrendingUp,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiDownload,
  FiFilter
} from 'react-icons/fi';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageName: string;
  price: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentMethod: string;
  autoRenew: boolean;
  transactionId: string;
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('startDate');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Rajesh Kumar',
          userEmail: 'rajesh.kumar@email.com',
          packageName: 'Gold',
          price: 999,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          paymentMethod: 'Credit Card',
          autoRenew: true,
          transactionId: 'TXN001'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Priya Sharma',
          userEmail: 'priya.sharma@email.com',
          packageName: 'VIP Elite',
          price: 4999,
          startDate: '2024-01-10',
          endDate: '2024-02-10',
          status: 'active',
          paymentMethod: 'UPI',
          autoRenew: true,
          transactionId: 'TXN002'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Amit Patel',
          userEmail: 'amit.patel@email.com',
          packageName: 'Silver',
          price: 499,
          startDate: '2023-12-15',
          endDate: '2024-01-15',
          status: 'expired',
          paymentMethod: 'Debit Card',
          autoRenew: false,
          transactionId: 'TXN003'
        },
        {
          id: '4',
          userId: 'user4',
          userName: 'Sneha Reddy',
          userEmail: 'sneha.reddy@email.com',
          packageName: 'Platinum',
          price: 1999,
          startDate: '2024-01-12',
          endDate: '2024-02-12',
          status: 'active',
          paymentMethod: 'Net Banking',
          autoRenew: true,
          transactionId: 'TXN004'
        },
        {
          id: '5',
          userId: 'user5',
          userName: 'Vikram Singh',
          userEmail: 'vikram.singh@email.com',
          packageName: 'Gold',
          price: 999,
          startDate: '2024-01-05',
          endDate: '2024-01-20',
          status: 'cancelled',
          paymentMethod: 'Credit Card',
          autoRenew: false,
          transactionId: 'TXN005'
        }
      ];
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case 'startDate':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'endDate':
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      case 'price':
        return b.price - a.price;
      case 'userName':
        return a.userName.localeCompare(b.userName);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubscriptions = sortedSubscriptions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageColor = (packageName: string) => {
    switch (packageName) {
      case 'VIP Elite':
        return 'bg-purple-100 text-purple-800';
      case 'Platinum':
        return 'bg-gray-100 text-gray-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (subscriptionId: string, newStatus: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, status: newStatus as any } : sub
    ));
  };

  const handleAutoRenewToggle = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? { ...sub, autoRenew: !sub.autoRenew } : sub
    ));
  };

  const calculateRevenue = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    return activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Subscriptions...</div>
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
                <FiCreditCard className="w-8 h-8 mr-3" />
                Subscription Management
              </h1>
              <p className="text-gray-600 mt-2">Monitor and manage user subscriptions</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={fetchSubscriptions}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiUsers className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Subscriptions</h3>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiCheck className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptions.filter(sub => sub.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiDollarSign className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculateRevenue())}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiTrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Auto-Renewal Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((subscriptions.filter(sub => sub.autoRenew).length / subscriptions.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="startDate">Sort by Start Date</option>
              <option value="endDate">Sort by End Date</option>
              <option value="price">Sort by Price</option>
              <option value="userName">Sort by Name</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <FiFilter className="w-4 h-4 mr-2" />
              {filteredSubscriptions.length} results
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auto-Renew
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{subscription.userName}</div>
                        <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                        <div className="text-xs text-gray-400">ID: {subscription.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPackageColor(subscription.packageName)}`}>
                        {subscription.packageName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(subscription.price)}
                      </div>
                      <div className="text-xs text-gray-500">{subscription.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <FiCalendar className="w-4 h-4 inline mr-1" />
                        {formatDate(subscription.startDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {formatDate(subscription.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAutoRenewToggle(subscription.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          subscription.autoRenew ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            subscription.autoRenew ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {subscription.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(subscription.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                        {subscription.status === 'expired' && (
                          <button
                            onClick={() => handleStatusChange(subscription.id, 'active')}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Renew
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedSubscriptions.length)} of {sortedSubscriptions.length} subscriptions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
