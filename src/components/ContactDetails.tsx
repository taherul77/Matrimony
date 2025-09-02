"use client";
import React, { useState, useEffect } from 'react';
import { FiPhone, FiMail, FiLock, FiEye } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface ContactDetailsProps {
  targetUserId: string;
  currentUserId: string;
  userPhone?: string;
  userEmail: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ 
  targetUserId, 
  currentUserId, 
  userPhone, 
  userEmail 
}) => {
  const { permissions, checkAction } = useBusinessLogic(currentUserId);
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactPermissions = async () => {
      if (!permissions) return;
      
      setLoading(true);
      const result = await checkAction('view_contact', targetUserId);
      setContactData(result);
      setLoading(false);
    };

    fetchContactPermissions();
  }, [permissions, targetUserId, checkAction]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  }

  if (!permissions) {
    return null;
  }

  // Free Package - Cannot view contact details
  if (!permissions.canViewContacts) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <FiLock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600 mb-1">
            Contact details hidden
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Upgrade to Silver or higher to view contact information
          </p>
          <button 
            onClick={() => window.location.href = '/packages'}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors"
          >
            Upgrade Package
          </button>
        </div>
      </div>
    );
  }

  // Silver Package - Partially masked contact details
  if (permissions.canViewContacts && !permissions.canViewFullContacts) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">Contact Details</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Silver Access
          </span>
        </div>
        
        <div className="space-y-2">
          {userPhone && (
            <div className="flex items-center">
              <FiPhone className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                {contactData?.contact?.phone || `${userPhone.substring(0, 3)}****${userPhone.substring(userPhone.length - 2)}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <FiMail className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">
              {contactData?.contact?.email || `${userEmail.substring(0, 2)}****@${userEmail.split('@')[1]}`}
            </span>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-700">
            📱 Upgrade to Gold for full contact details
          </p>
        </div>
      </div>
    );
  }

  // Gold+ Package - Full contact details
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">Contact Details</h3>
        <div className="flex items-center">
          <HiSparkles className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Premium Access
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {userPhone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiPhone className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-800">{userPhone}</span>
            </div>
            <button 
              onClick={() => window.open(`tel:${userPhone}`)}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Call
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiMail className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">{userEmail}</span>
          </div>
          <button 
            onClick={() => window.open(`mailto:${userEmail}`)}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            Email
          </button>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded">
        <p className="text-xs text-green-700 flex items-center">
          <FiEye className="w-3 h-3 mr-1" />
          Full contact access with your premium package
        </p>
      </div>
    </div>
  );
};

export default ContactDetails;
