import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, AuthUser } from '@/types/auth';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        setAuthState({
          user: storedUser,
          isAuthenticated: !!storedUser,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await authService.initiateLogin();
      // Note: This will redirect, so state update won't complete
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const currentUser = authState.user;
      await authService.logout(currentUser?.idToken);
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Always clear state even if remote logout fails
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  // Refresh session
  const refreshSession = async (): Promise<void> => {
    try {
      const storedUser = authService.getStoredUser();
      setAuthState(prev => ({
        ...prev,
        user: storedUser,
        isAuthenticated: !!storedUser,
        error: null,
      }));
    } catch (error) {
      console.error('Session refresh failed:', error);
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        error: 'Session refresh failed',
      }));
    }
  };

  // Handle auth success (called from callback page)
  const handleAuthSuccess = (user: AuthUser) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  // Handle auth error
  const handleAuthError = (error: string) => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error,
    });
  };

  const contextValue: AuthContextType = {
    ...authState,
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

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for components that require authentication
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};