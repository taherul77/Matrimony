'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiUserPlus, 
  FiEye, 
  FiTrash2, 
  FiSearch, 
  FiPackage, 
  FiDollarSign, 
  FiTrendingUp,
  FiHeart,
  FiMessageCircle,
  FiSettings,
  FiBarChart,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiPlus
} from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  role: string;
  createdAt: string;
  subscription?: {
    package: {
      name: string;
      price: number;
      priorityLevel: number;
    };
    endDate: string;
    isActive: boolean;
  };
  profile?: {
    photos: string[];
    location?: string;
    occupation?: string;
  };
}

interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  maxPhotos: number;
  maxInterests: number;
  priorityLevel: number;
  isActive: boolean;
}

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todayRegistrations: number;
  maleUsers: number;
  femaleUsers: number;
  totalMatches: number;
  totalInterests: number;
  packageDistribution: {
    name: string;
    count: number;
    revenue: number;
  }[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    todayRegistrations: 0,
    maleUsers: 0,
    femaleUsers: 0,
    totalMatches: 0,
    totalInterests: 0,
    packageDistribution: []
  });

  useEffect(() => {
    fetchUsers();
    fetchPackages();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demonstration
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'male',
          age: 28,
          role: 'user',
          createdAt: new Date().toISOString(),
          subscription: {
            package: { name: 'Gold', price: 1500, priorityLevel: 2 },
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          profile: { photos: [], location: 'Dhaka', occupation: 'Engineer' }
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          gender: 'female',
          age: 26,
          role: 'user',
          createdAt: new Date().toISOString(),
          profile: { photos: [], location: 'Chittagong', occupation: 'Doctor' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data for demonstration
      setStats({
        totalUsers: 300,
        activeSubscriptions: 120,
        totalRevenue: 125000,
        todayRegistrations: 12,
        maleUsers: 180,
        femaleUsers: 120,
        totalMatches: 1250,
        totalInterests: 8500,
        packageDistribution: [
          { name: 'Free', count: 150, revenue: 0 },
          { name: 'Silver', count: 80, revenue: 40000 },
          { name: 'Gold', count: 45, revenue: 67500 },
          { name: 'Platinum', count: 20, revenue: 50000 },
          { name: 'VIP', count: 5, revenue: 25000 }
        ]
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const togglePackageStatus = async (packageId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const seedPackages = async () => {
    try {
      const response = await fetch('/api/seed/packages', { method: 'POST' });
      if (response.ok) {
        alert('Packages seeded successfully!');
        fetchPackages();
        fetchStats();
      }
    } catch (error) {
      console.error('Error seeding packages:', error);
      alert('Failed to seed packages');
    }
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || user.gender === filterGender;
    const matchesSubscription = filterSubscription === 'all' || 
                               (filterSubscription === 'subscribed' && user.subscription?.isActive) ||
                               (filterSubscription === 'free' && !user.subscription?.isActive);
    return matchesSearch && matchesGender && matchesSubscription;
  });

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your matrimonial platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={seedPackages}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPackage className="w-4 h-4 inline mr-2" />
                Seed Packages
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <FiUserPlus className="w-4 h-4 inline mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: FiBarChart },
                { id: 'users', name: 'Users', icon: FiUsers },
                { id: 'packages', name: 'Packages', icon: FiPackage },
                { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={FiUsers}
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    change={8.2}
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={FiDollarSign}
                    title="Total Revenue"
                    value={`৳${stats.totalRevenue.toLocaleString()}`}
                    change={12.5}
                    color="bg-green-500"
                  />
                  <StatCard
                    icon={FiHeart}
                    title="Active Subscriptions"
                    value={stats.activeSubscriptions.toLocaleString()}
                    change={5.1}
                    color="bg-pink-500"
                  />
                  <StatCard
                    icon={FiUserPlus}
                    title="Today's Registrations"
                    value={stats.todayRegistrations}
                    change={-2.3}
                    color="bg-purple-500"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Package Distribution */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Distribution</h3>
                    <div className="space-y-3">
                      {stats.packageDistribution.map((pkg) => (
                        <div key={pkg.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              pkg.name === 'Free' ? 'bg-gray-400' :
                              pkg.name === 'Silver' ? 'bg-gray-500' :
                              pkg.name === 'Gold' ? 'bg-yellow-500' :
                              pkg.name === 'Platinum' ? 'bg-purple-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{pkg.count} users</div>
                            <div className="text-xs text-gray-500">৳{pkg.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiHeart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-gray-600">245 new interests sent today</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiMessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">189 messages exchanged</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiUserPlus className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">12 new registrations</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiDollarSign className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">8 new subscriptions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <FiUsers className="w-6 h-6 text-blue-500 mb-2" />
                      <div className="font-medium text-gray-900">Manage Users</div>
                      <div className="text-sm text-gray-500">View and manage all registered users</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <FiPackage className="w-6 h-6 text-green-500 mb-2" />
                      <div className="font-medium text-gray-900">Package Settings</div>
                      <div className="text-sm text-gray-500">Configure subscription packages</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <FiBarChart className="w-6 h-6 text-purple-500 mb-2" />
                      <div className="font-medium text-gray-900">View Analytics</div>
                      <div className="text-sm text-gray-500">Check platform performance</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <select
                    value={filterSubscription}
                    onChange={(e) => setFilterSubscription(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="subscribed">Subscribed</option>
                    <option value="free">Free Users</option>
                  </select>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscription
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                              </div>
                            </td>
                          </tr>
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.age} years old • {user.gender}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{user.email}</div>
                                <div className="text-sm text-gray-500">{user.profile?.location || 'Not specified'}</div>
                              </td>
                              <td className="px-6 py-4">
                                {user.subscription?.isActive ? (
                                  <div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      user.subscription.package.name === 'Free' ? 'bg-gray-100 text-gray-800' :
                                      user.subscription.package.name === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                      user.subscription.package.name === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                      user.subscription.package.name === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {user.subscription.package.name}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Expires: {new Date(user.subscription.endDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Free
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Profile"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit User"
                                  >
                                    <FiEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete User"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Package Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <FiPlus className="w-4 h-4 inline mr-2" />
                    Add Package
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                        <button
                          onClick={() => togglePackageStatus(pkg.id, pkg.isActive)}
                          className={`p-1 rounded-full transition-colors ${
                            pkg.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {pkg.isActive ? <FiCheckCircle className="w-5 h-5" /> : <FiXCircle className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-2xl font-bold text-gray-900">৳{pkg.price}</p>
                        <p className="text-sm text-gray-600">{pkg.duration} days</p>
                        <p className="text-sm text-gray-600">Priority Level: {pkg.priorityLevel}</p>
                      </div>
                      <div className="space-y-1 mb-4">
                        <p className="text-xs text-gray-500">
                          Photos: {pkg.maxPhotos === -1 ? 'Unlimited' : pkg.maxPhotos}
                        </p>
                        <p className="text-xs text-gray-500">
                          Daily Interests: {pkg.maxInterests === -1 ? 'Unlimited' : pkg.maxInterests}
                        </p>
                        <p className={`text-xs ${pkg.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          Status: {pkg.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors">
                          <FiEdit className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        <button className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100 transition-colors">
                          <FiTrash2 className="w-3 h-3 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {packages.length === 0 && (
                  <div className="text-center py-12">
                    <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first package or seeding default packages.</p>
                    <button 
                      onClick={seedPackages}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Seed Default Packages
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Chart placeholder - Integrate with charting library</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Chart placeholder - Integrate with charting library</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Success Rate</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Interests Sent</span>
                        <span className="text-sm font-bold text-gray-900">{stats.totalInterests}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Successful Matches</span>
                        <span className="text-sm font-bold text-gray-900">{stats.totalMatches}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Success Rate</span>
                        <span className="text-sm font-bold text-green-600">
                          {stats.totalInterests > 0 ? ((stats.totalMatches / stats.totalInterests) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${stats.totalInterests > 0 ? (stats.totalMatches / stats.totalInterests) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiUsers className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-600">Active Users Today</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {Math.floor(stats.totalUsers * 0.15)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiHeart className="w-4 h-4 text-pink-500 mr-2" />
                          <span className="text-sm text-gray-600">Interests Today</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">245</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiMessageCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">Messages Today</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">189</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="text-sm text-gray-600">Profile Views Today</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">1,234</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Revenue Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {stats.packageDistribution.map((pkg) => (
                      <div key={pkg.name} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${
                          pkg.name === 'Free' ? 'bg-gray-400' :
                          pkg.name === 'Silver' ? 'bg-gray-500' :
                          pkg.name === 'Gold' ? 'bg-yellow-500' :
                          pkg.name === 'Platinum' ? 'bg-purple-500' : 'bg-red-500'
                        }`}></div>
                        <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                        <div className="text-xs text-gray-500">{pkg.count} users</div>
                        <div className="text-sm font-bold text-gray-900">৳{pkg.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}