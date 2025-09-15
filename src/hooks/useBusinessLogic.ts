import { useState, useEffect, useCallback, useRef } from 'react';
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
  const activeRequests = useRef<Set<string>>(new Set());
  const cache = useRef<Map<string, any>>(new Map());
  const lastFetch = useRef<number>(0);

  const fetchPermissions = useCallback(async () => {
    if (!userId) return;
    
    const now = Date.now();
    const requestKey = `fetch_permissions_${userId}`;
    
    // Prevent duplicate requests within 1 second
    if (activeRequests.current.has(requestKey) || (now - lastFetch.current < 1000)) {
      return;
    }
    
    try {
      setLoading(true);
      activeRequests.current.add(requestKey);
      lastFetch.current = now;
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
      activeRequests.current.delete(requestKey);
    }
  }, [userId]);

  const checkAction = useCallback(async (action: string, targetUserId?: string) => {
    if (!userId) return { allowed: false, message: 'User not logged in' };
    
    const requestKey = `${action}_${userId}_${targetUserId || 'no_target'}`;
    
    // Check cache first (valid for 30 seconds)
    if (cache.current.has(requestKey)) {
      const cached = cache.current.get(requestKey);
      if (Date.now() - cached.timestamp < 30000) {
        return cached.data;
      } else {
        cache.current.delete(requestKey);
      }
    }
    
    // Prevent duplicate requests
    if (activeRequests.current.has(requestKey)) {
      return { allowed: false, message: 'Request in progress' };
    }
    
    try {
      activeRequests.current.add(requestKey);
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
      
      const result = await response.json();
      
      // Cache the result
      cache.current.set(requestKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (err) {
      return { 
        allowed: false, 
        message: err instanceof Error ? err.message : 'Error checking permission' 
      };
    } finally {
      activeRequests.current.delete(requestKey);
    }
  }, [userId]);

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
