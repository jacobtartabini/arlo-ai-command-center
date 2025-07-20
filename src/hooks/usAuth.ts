// src/hooks/useAuth.ts (or update wherever your hook is defined)
import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login: () => signIn('zitadel'),
    logout: () => signOut({ callbackUrl: '/' }),
  };
};
