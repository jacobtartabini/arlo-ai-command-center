'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>; // kept for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const login = async () => {
    try {
      await signIn('zitadel'); // Triggers Zitadel OAuth login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshSession = async () => {
    // Optional – no-op placeholder for compatibility
    // NextAuth handles refreshing internally if configured
    return;
  };

  const contextValue: AuthContextType = {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    error: null, // You can handle errors from the `useSession` status or query params if needed
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (typeof window !== 'undefined') {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }

  return { isAuthenticated, isLoading };
};
