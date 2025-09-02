"use client";
import React, { useState, useEffect } from 'react';
import { FiSend, FiLock, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface InterestButtonProps {
  targetUserId: string;
  currentUserId: string;
  onInterestSent?: () => void;
}

const InterestButton: React.FC<InterestButtonProps> = ({ 
  targetUserId, 
  currentUserId, 
  onInterestSent 
}) => {
  const { permissions, usage, checkAction } = useBusinessLogic(currentUserId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSendInterest = async () => {
    if (!permissions || !usage) return;

    // Check if user can send interest
    const canSend = await checkAction('send_interest');
    
    if (!canSend.allowed) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          message: message || 'I am interested in your profile'
        }),
      });

      if (response.ok) {
        alert('Interest sent successfully!');
        onInterestSent?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send interest');
      }
    } catch (error) {
      alert('Failed to send interest');
    } finally {
      setLoading(false);
    }
  };

  if (!permissions || !usage) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded"></div>;
  }

  const { interests } = usage;
  const remainingInterests = interests.limit === -1 ? '∞' : interests.limit - interests.current;

  return (
    <div className="space-y-3">
      {/* Interest Limit Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Daily Interests:</span>
        <span className={`font-medium ${interests.allowed ? 'text-green-600' : 'text-red-600'}`}>
          {interests.current}/{interests.limit === -1 ? '∞' : interests.limit}
          {interests.limit !== -1 && ` (${remainingInterests} left)`}
        </span>
      </div>

      {/* Send Interest Button */}
      <button
        onClick={handleSendInterest}
        disabled={!interests.allowed || loading}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
          interests.allowed 
            ? 'bg-pink-600 hover:bg-pink-700 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <FiSend className="w-4 h-4 mr-2" />
        {loading ? 'Sending...' : interests.allowed ? 'Send Interest' : 'Limit Reached'}
      </button>

      {/* Upgrade Prompt */}
      {showUpgrade && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <HiSparkles className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Daily interest limit reached!
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Upgrade to Silver (20/day) or Gold (unlimited) for more interests
              </p>
              <button 
                onClick={() => window.location.href = '/packages'}
                className="text-xs bg-yellow-600 text-white px-2 py-1 rounded mt-2 hover:bg-yellow-700"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestButton;
