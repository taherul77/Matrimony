"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Add role field
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        setUser(data.user || null);
        
        // Update sessionStorage with fresh user data if logged in
        if (data.isLoggedIn && data.user) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Clear storage if not logged in
          sessionStorage.removeItem('user');
          localStorage.removeItem('user'); // Clear old localStorage data too
          document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } else {
        console.log('Auth check failed, cleaning up and redirecting...');
        setIsLoggedIn(false);
        setUser(null);
        // Clear storage on failed auth
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // If we're on a protected route and auth failed, redirect to login
        if (typeof window !== 'undefined') {
          const protectedRoutes = ['/dashboard', '/profile', '/matches', '/messages', '/search', '/compatibility', '/interests', '/packages', '/vip', '/admin'];
          const currentPath = window.location.pathname;
          const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
          
          if (isProtectedRoute) {
            window.location.href = '/login';
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setIsLoggedIn(false);
      setUser(null);
      // Clear storage on error
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Check session validity every 5 minutes
    const interval = setInterval(fetchUser, 5 * 60 * 1000);

    // Check auth when the page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const refetchUser = async () => {
    await fetchUser();
  };

  const value: UserContextType = {
    user,
    isLoading,
    isLoggedIn,
    refetchUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};