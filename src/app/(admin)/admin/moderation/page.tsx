"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiEye, 
  FiFlag, 
  FiCheck, 
  FiX, 
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
  FiImage
} from 'react-icons/fi';
import Image from 'next/image';

interface ModerationItem {
  id: string;
  type: 'profile' | 'photo' | 'content';
  userId: string;
  userName: string;
  userEmail: string;
  reportReason: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content?: {
    type: string;
    url?: string;
    text?: string;
  };
  profileImage?: string;
  notes?: string;
}

const ProfileModerationPage: React.FC = () => {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchModerationItems();
  }, []);

  const fetchModerationItems = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockItems: ModerationItem[] = [
        {
          id: '1',
          type: 'profile',
          userId: 'user1',
          userName: 'John Doe',
          userEmail: 'john.doe@email.com',
          reportReason: 'Inappropriate profile description',
          reportedBy: 'user2',
          reportedAt: '2024-01-20T10:30:00Z',
          status: 'pending',
          priority: 'high',
          content: {
            type: 'description',
            text: 'Looking for someone special...'
          },
          profileImage: '/uploads/1755858552715_user2.jpg'
        },
        {
          id: '2',
          type: 'photo',
          userId: 'user3',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@email.com',
          reportReason: 'Inappropriate photo content',
          reportedBy: 'user4',
          reportedAt: '2024-01-19T14:20:00Z',
          status: 'pending',
          priority: 'urgent',
          content: {
            type: 'photo',
            url: '/uploads/1755863927941_user2.jpg'
          }
        },
        {
          id: '3',
          type: 'content',
          userId: 'user5',
          userName: 'Mike Johnson',
          userEmail: 'mike.johnson@email.com',
          reportReason: 'Spam messages',
          reportedBy: 'user6',
          reportedAt: '2024-01-18T09:15:00Z',
          status: 'flagged',
          priority: 'medium',
          content: {
            type: 'message',
            text: 'Hey, check out this amazing offer...'
          },
          notes: 'User has been warned previously'
        }
      ];
      setModerationItems(mockItems);
    } catch (error) {
      console.error('Error fetching moderation items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = moderationItems.filter(item => {
    const statusMatch = filter === 'all' || item.status === filter;
    const typeMatch = typeFilter === 'all' || item.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'flagged':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-green-50 border-green-300 text-green-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return <FiUser className="w-5 h-5" />;
      case 'photo':
        return <FiImage className="w-5 h-5" />;
      case 'content':
        return <FiMessageSquare className="w-5 h-5" />;
      default:
        return <FiFlag className="w-5 h-5" />;
    }
  };

  const handleModerationAction = (itemId: string, action: 'approve' | 'reject' | 'flag', notes?: string) => {
    setModerationItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged', notes } 
          : item
      )
    );
    setShowModal(false);
    setSelectedItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Moderation Queue...</div>
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
                <FiEye className="w-8 h-8 mr-3" />
                Profile Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review reported profiles, photos, and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredItems.filter(item => item.status === 'pending').length} pending reviews
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiAlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiFlag className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Urgent</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiCheck className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiX className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <div className="flex space-x-2">
                {['all', 'pending', 'approved', 'rejected', 'flagged'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type Filter</label>
              <div className="flex space-x-2">
                {['all', 'profile', 'photo', 'content'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                      typeFilter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Moderation Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-6 ${getPriorityColor(item.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {item.profileImage ? (
                      <Image
                        src={item.profileImage}
                        alt={item.userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <h3 className="font-semibold text-gray-900">{item.userName}</h3>
                      <span className="text-sm text-gray-500 capitalize">({item.type})</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <FiMail className="w-4 h-4 mr-1" />
                        {item.userEmail}
                      </span>
                      <span className="flex items-center">
                        <FiFlag className="w-4 h-4 mr-1" />
                        {item.reportReason}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      <FiCalendar className="w-4 h-4 inline mr-1" />
                      {formatDate(item.reportedAt)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Priority: {item.priority}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEye className="w-4 h-4 mr-2 inline" />
                    Review
                  </button>
                </div>
              </div>

              {item.content && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reported Content:</h4>
                  {item.content.type === 'photo' && item.content.url ? (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <Image
                        src={item.content.url}
                        alt="Reported content"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{item.content.text}</p>
                    </div>
                  )}
                </div>
              )}

              {item.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Review Moderation Request</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Report Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                        <span>User: {selectedItem.userName}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Email: {selectedItem.userEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <FiFlag className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Reason: {selectedItem.reportReason}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Reported: {formatDate(selectedItem.reportedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <FiAlertTriangle className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Priority: {selectedItem.priority}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Reported Content</h4>
                    {selectedItem.content && (
                      <div className="border rounded-lg p-4">
                        <div className="mb-2">
                          <span className="font-medium capitalize">{selectedItem.content.type}</span>
                        </div>
                        {selectedItem.content.type === 'photo' && selectedItem.content.url ? (
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <Image
                              src={selectedItem.content.url}
                              alt="Reported content"
                              width={300}
                              height={300}
                              className="rounded-lg object-cover mx-auto"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{selectedItem.content.text}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleModerationAction(selectedItem.id, 'approve')}
                    className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiCheck className="w-5 h-5 inline mr-2" />
                    Approve Content
                  </button>
                  <button
                    onClick={() => handleModerationAction(selectedItem.id, 'flag', 'Content flagged for review')}
                    className="bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FiFlag className="w-5 h-5 inline mr-2" />
                    Flag for Review
                  </button>
                  <button
                    onClick={() => handleModerationAction(selectedItem.id, 'reject', 'Content violates community guidelines')}
                    className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiX className="w-5 h-5 inline mr-2" />
                    Reject Content
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

export default ProfileModerationPage;
