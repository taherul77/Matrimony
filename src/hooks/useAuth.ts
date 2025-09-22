"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear all storage
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    
    // Clear user cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      handleLogout();
      router.push('/login');
    }
  }, [handleLogout, router]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsAuthenticated(true);
          setUser(data.user);
          
          // Update session storage with fresh user data
          sessionStorage.setItem('user', JSON.stringify(data.user));
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    checkAuth();

    // Check auth every 5 minutes to ensure session is still valid
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Check auth when the page becomes visible (browser tab regains focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    logout,
    checkAuth
  };
};