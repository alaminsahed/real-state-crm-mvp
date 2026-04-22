import { useEffect, useMemo, useState } from 'react';
import {
  getStoredSession,
  getValidAccessToken,
  signInWithPassword,
  signOut,
} from '../../lib/supabaseAuth';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(getStoredSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setSession(null);
          return;
        }
        setSession(getStoredSession());
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrapSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.access_token),
      isLoading,
      login: async (email: string, password: string) => {
        const nextSession = await signInWithPassword(email, password);
        setSession(nextSession);
      },
      logout: async () => {
        await signOut();
        setSession(null);
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
