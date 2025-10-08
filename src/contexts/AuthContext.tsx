import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser, useSignOut } from '@/hooks/useAuth';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signOut: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: userData, isLoading, error, refetch } = useCurrentUser();
  const signOutMutation = useSignOut();

  const user = userData?.user || null;
  const isAuthenticated = !!user;

  const signOut = () => {
    signOutMutation.mutate();
  };

  const refetchUser = () => {
    refetch();
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    error: error?.message || null,
    signOut,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
