import { useState, useEffect, useCallback } from 'react';
import { UserPermissions } from '@/lib/permissions';

interface UserUsage {
  interests: { current: number; limit: number; allowed: boolean };
  messages: { current: number; limit: number; allowed: boolean };
  photos: { current: number; limit: number; allowed: boolean };
}

interface UseBusinessLogicReturn {
  permissions: UserPermissions | null;
  usage: UserUsage | null;
  loading: boolean;
  error: string | null;
  checkAction: (action: string, targetUserId?: string) => Promise<{ allowed: boolean; message?: string }>;
  refreshPermissions: () => void;
}

export function useBusinessLogic(userId?: string): UseBusinessLogicReturn {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/business/features?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const data = await response.json();
      setPermissions(data.permissions);
      setUsage(data.usage);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const checkAction = async (action: string, targetUserId?: string) => {
    if (!userId) return { allowed: false, message: 'User not logged in' };
    
    try {
      const response = await fetch('/api/business/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId,
          targetUserId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check action permission');
      }
      
      return await response.json();
    } catch (err) {
      return { 
        allowed: false, 
        message: err instanceof Error ? err.message : 'Error checking permission' 
      };
    }
  };

  const refreshPermissions = () => {
    fetchPermissions();
  };

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    usage,
    loading,
    error,
    checkAction,
    refreshPermissions
  };
}
