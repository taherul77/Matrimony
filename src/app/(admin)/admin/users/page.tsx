"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiX,
  FiCheck
} from 'react-icons/fi';
import Image from 'next/image';

interface User {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  package: string;
  role?: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  created_at?: string;
  lastActive: string;
  profileImage?: string;
  profile_image?: string;
  verified: boolean;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first, fall back to mock data
      try {
        const res = await fetch('/api/admin/users-paginate?page=1&per_page=100');
        if (res.ok) {
          const result = await res.json();
          if (result.data && result.data.data) {
            // Transform API data to match our interface
            const transformedUsers = result.data.data.map((user: any) => ({
              id: user.id || user._id,
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              email: user.email,
              phone: user.phone || 'N/A',
              age: user.age || 25,
              location: user.location || 'India',
              package: user.package || 'Free',
              status: user.status || 'active',
              joinDate: user.createdAt || user.joinDate || new Date().toISOString(),
              lastActive: user.lastActive || user.updatedAt || new Date().toISOString(),
              profileImage: user.profileImage || user.avatar,
              verified: user.verified || false
            }));
            setUsers(transformedUsers);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Mock data fallback
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 9876543210',
          age: 28,
          location: 'Mumbai, Maharashtra',
          package: 'Gold',
          status: 'active',
          joinDate: '2024-01-15',
          lastActive: '2024-01-20',
          verified: true,
          profileImage: '/uploads/1755858552715_user2.jpg'
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phone: '+91 9876543211',
          age: 26,
          location: 'Delhi, India',
          package: 'VIP',
          status: 'active',
          joinDate: '2024-01-10',
          lastActive: '2024-01-20',
          verified: true
        },
        {
          id: '3',
          name: 'Amit Patel',
          email: 'amit.patel@email.com',
          phone: '+91 9876543212',
          age: 30,
          location: 'Ahmedabad, Gujarat',
          package: 'Silver',
          status: 'inactive',
          joinDate: '2024-01-08',
          lastActive: '2024-01-18',
          verified: false
        },
        {
          id: '4',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@email.com',
          phone: '+91 9876543213',
          age: 25,
          location: 'Hyderabad, Telangana',
          package: 'Platinum',
          status: 'active',
          joinDate: '2024-01-12',
          lastActive: '2024-01-20',
          verified: true
        },
        {
          id: '5',
          name: 'Vikram Singh',
          email: 'vikram.singh@email.com',
          phone: '+91 9876543214',
          age: 32,
          location: 'Jaipur, Rajasthan',
          package: 'Free',
          status: 'suspended',
          joinDate: '2024-01-05',
          lastActive: '2024-01-16',
          verified: false
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = filterPackage === 'all' || user.package === filterPackage;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesPackage && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackageColor = (packageName: string) => {
    switch (packageName) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Platinum':
        return 'bg-gray-100 text-gray-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-blue-100 text-blue-800';
      case 'Free':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'view':
        const user = users.find(u => u.id === userId);
        setSelectedUser(user || null);
        setShowUserModal(true);
        break;
      case 'edit':
        // Navigate to edit user page
        console.log('Edit user:', userId);
        break;
      case 'suspend':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'suspended' as const } : u
        ));
        break;
      case 'activate':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== userId));
        }
        break;
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    
    switch (action) {
      case 'activate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'suspend':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'suspended' as const } : u
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(users.filter(u => !selectedUsers.includes(u.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Users...</div>
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
                <FiUsers className="w-8 h-8 mr-3" />
                User Management
              </h1>
              <p className="text-gray-600 mt-2">Manage platform users and their accounts</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New User
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Packages</option>
              <option value="Free">Free</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="VIP">VIP</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="joinDate">Sort by Join Date</option>
              <option value="name">Sort by Name</option>
              <option value="lastActive">Sort by Last Active</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(currentUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.profileImage || user.profile_image || "/file.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.package === 'VIP' ? 'bg-purple-100 text-purple-700' : user.package === 'Gold' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {user.package}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.created_at || user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Simple Pagination Controls */}
            <div className="flex justify-center items-center gap-2 py-4">
              <button
                className="px-3 py-1 rounded border text-xs font-medium disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage}
              </span>
              <button
                className="px-3 py-1 rounded border text-xs font-medium"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
