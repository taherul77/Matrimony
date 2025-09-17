"use client";

import React, { ReactNode } from 'react';
import { UserProvider, useUser } from './UserContext';
import { SocketProvider } from './SocketContext';

interface AppProvidersProps {
  children: ReactNode;
}

// Socket wrapper that depends on user data
const SocketWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useUser();
  
  return (
    <SocketProvider userId={isLoggedIn ? user?.id : undefined}>
      {children}
    </SocketProvider>
  );
};

// Combined providers
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      <SocketWrapper>
        {children}
      </SocketWrapper>
    </UserProvider>
  );
};