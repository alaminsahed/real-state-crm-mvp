import { createContext } from 'react';
import type { SupabaseSession } from '../../lib/supabaseAuth';

export type AuthContextValue = {
  session: SupabaseSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
