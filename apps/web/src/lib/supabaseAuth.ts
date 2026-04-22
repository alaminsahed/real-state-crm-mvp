const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_STORAGE_KEY = 'crm_session';

type SupabaseUser = {
  id: string;
  email?: string;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseUser;
};

type SupabaseAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseUser;
  error?: string;
  error_description?: string;
  msg?: string;
};

function ensureEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  }
}

function parseAuthError(payload: SupabaseAuthResponse): string {
  return payload.error_description ?? payload.msg ?? payload.error ?? 'Authentication failed';
}

function toSession(payload: SupabaseAuthResponse): SupabaseSession {
  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_at: payload.expires_at,
    user: payload.user,
  };
}

export function getStoredSession(): SupabaseSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SupabaseSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function saveSession(session: SupabaseSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function isExpired(expiresAt?: number) {
  if (!expiresAt) {
    return false;
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  return expiresAt <= nowSeconds + 30;
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  ensureEnv();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(parseAuthError(payload));
  }

  const session = toSession(payload);
  saveSession(session);
  return session;
}

export async function refreshStoredSession(): Promise<SupabaseSession> {
  ensureEnv();
  const session = getStoredSession();
  if (!session?.refresh_token) {
    throw new Error('Session not found');
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  const payload = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    clearSession();
    throw new Error(parseAuthError(payload));
  }

  const refreshed = toSession(payload);
  saveSession(refreshed);
  return refreshed;
}

export async function getValidAccessToken(): Promise<string> {
  const session = getStoredSession();
  if (!session) {
    return '';
  }

  if (!isExpired(session.expires_at)) {
    return session.access_token;
  }

  const refreshed = await refreshStoredSession();
  return refreshed.access_token;
}

export async function signOut(): Promise<void> {
  const session = getStoredSession();
  clearSession();

  if (!session?.access_token || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return;
  }

  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
  });
}
