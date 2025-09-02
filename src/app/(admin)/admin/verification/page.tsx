"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiCheck, 
  FiX, 
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import Image from 'next/image';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  profileImage?: string;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

const UserVerificationPage: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockRequests: VerificationRequest[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Rajesh Kumar',
          userEmail: 'rajesh.kumar@email.com',
          userPhone: '+91 9876543210',
          profileImage: '/uploads/1755858552715_user2.jpg',
          documents: [
            { type: 'ID Proof', url: '/documents/id1.jpg', status: 'pending' },
            { type: 'Address Proof', url: '/documents/address1.jpg', status: 'pending' }
          ],
          requestedAt: '2024-01-20T10:30:00Z',
          status: 'pending',
          priority: 'high'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Priya Sharma',
          userEmail: 'priya.sharma@email.com',
          userPhone: '+91 9876543211',
          documents: [
            { type: 'ID Proof', url: '/documents/id2.jpg', status: 'approved' },
            { type: 'Address Proof', url: '/documents/address2.jpg', status: 'approved' }
          ],
          requestedAt: '2024-01-19T14:20:00Z',
          status: 'approved',
          priority: 'medium'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Amit Patel',
          userEmail: 'amit.patel@email.com',
          userPhone: '+91 9876543212',
          documents: [
            { type: 'ID Proof', url: '/documents/id3.jpg', status: 'rejected' }
          ],
          requestedAt: '2024-01-18T09:15:00Z',
          status: 'rejected',
          priority: 'low',
          notes: 'Document not clear, please resubmit'
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleVerificationAction = (requestId: string, action: 'approve' | 'reject', notes?: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'approve' ? 'approved' : 'rejected', notes } 
        : req
    ));
    setShowModal(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Verification Requests...</div>
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
                <FiShield className="w-8 h-8 mr-3" />
                User Verification
              </h1>
              <p className="text-gray-600 mt-2">Review and approve user verification requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredRequests.filter(r => r.status === 'pending').length} pending requests
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiClock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'pending').length}
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
                  {requests.filter(r => r.status === 'approved').length}
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
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <FiAlertCircle className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex space-x-4">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
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

        {/* Verification Requests */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className={`bg-white rounded-xl shadow-sm border p-6 ${getPriorityColor(request.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {request.profileImage ? (
                      <Image
                        src={request.profileImage}
                        alt={request.userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiMail className="w-4 h-4 mr-1" />
                        {request.userEmail}
                      </span>
                      <span className="flex items-center">
                        <FiPhone className="w-4 h-4 mr-1" />
                        {request.userPhone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      <FiCalendar className="w-4 h-4 inline mr-1" />
                      {formatDate(request.requestedAt)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEye className="w-4 h-4 mr-2 inline" />
                    Review
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Documents Submitted:</h4>
                <div className="flex space-x-4">
                  {request.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{doc.type}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {request.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{request.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Review Verification Request</h3>
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
                    <h4 className="font-semibold text-gray-900 mb-4">User Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedRequest.userName}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedRequest.userEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedRequest.userPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Requested: {formatDate(selectedRequest.requestedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Documents</h4>
                    <div className="space-y-4">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{doc.type}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <span className="text-gray-500">Document Preview</span>
                            <div className="mt-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                View Full Size
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => handleVerificationAction(selectedRequest.id, 'approve')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiCheck className="w-5 h-5 inline mr-2" />
                    Approve Verification
                  </button>
                  <button
                    onClick={() => handleVerificationAction(selectedRequest.id, 'reject', 'Documents need review')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiX className="w-5 h-5 inline mr-2" />
                    Reject Request
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

export default UserVerificationPage;
