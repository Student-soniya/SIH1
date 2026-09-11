import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  API_BASE,
  clearStoredRefreshToken,
  configureTokenFetch,
  readStoredRefreshToken,
  refreshSession,
  tokenFetchJson,
  writeStoredRefreshToken
} from './tokenFetch';

// Session state for the whole app (R5.3, R5.4, R5.10; design C12).
//
// The access token lives in a `useRef` and nowhere else: not in state (which would put it in the
// React tree and in devtools output) and not in localStorage (where any script on the page could
// read it). It therefore lasts exactly as long as the loaded page, which is what R5.3 asks for.
// Only the refresh token is persisted, so a reload re-establishes the session through the refresh
// endpoint rather than by holding a long-lived credential in storage.

const AuthContext = createContext(null);

/** Distinguishes "your credentials were wrong" from "your session ended" (R5.7). */
export const AUTH_MESSAGES = {
  badCredentials: 'Email address or password is incorrect. Please try again.',
  sessionEnded: 'Your session has ended. Please sign in again to continue.'
};

export function AuthProvider({ children }) {
  const accessTokenRef = useRef(null);

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [authMessage, setAuthMessage] = useState(null);

  // R5.4 — while this is true no authenticated view renders, so the one-and-only refresh call
  // completes before anything can fire a protected request.
  const [restoring, setRestoring] = useState(() => Boolean(readStoredRefreshToken()));

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    clearStoredRefreshToken();
    setUser(null);
    setRoles([]);
  }, []);

  // Wire the fetch wrapper to this provider's ref exactly once.
  useEffect(() => {
    configureTokenFetch({
      getAccessToken: () => accessTokenRef.current,
      setAccessToken: (token) => { accessTokenRef.current = token || null; },
      onSessionLost: () => {
        accessTokenRef.current = null;
        clearStoredRefreshToken();
        setUser(null);
        setRoles([]);
        setAuthMessage(AUTH_MESSAGES.sessionEnded);
      }
    });
  }, []);

  const loadMe = useCallback(async () => {
    const me = await tokenFetchJson('auth/me');
    setUser({ userId: me.userId, displayName: me.displayName, partnerId: me.partnerId ?? null });
    setRoles(Array.isArray(me.roles) ? me.roles : []);
    return me;
  }, []);

  // R5.4 — exactly one refresh call on load, and only when a refresh token is stored.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!readStoredRefreshToken()) {
        setRestoring(false);
        return;
      }

      const pair = await refreshSession();
      if (cancelled) return;

      if (!pair) {
        clearSession();
        setRestoring(false);
        return;
      }

      try {
        await loadMe();
      } catch {
        clearSession();
      } finally {
        if (!cancelled) setRestoring(false);
      }
    }

    restore();
    return () => { cancelled = true; };
  }, [clearSession, loadMe]);

  /** R5.7 — a 401 here means bad credentials, which is a different message from an ended session. */
  const login = useCallback(async (email, password) => {
    setAuthMessage(null);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.status === 401) {
      clearSession();
      setAuthMessage(AUTH_MESSAGES.badCredentials);
      return { ok: false, message: AUTH_MESSAGES.badCredentials };
    }

    if (res.status === 423) {
      const body = await res.json().catch(() => ({}));
      const message = body.error || 'This account is temporarily locked. Please try again later.';
      setAuthMessage(message);
      return { ok: false, message };
    }

    if (!res.ok) {
      const message = 'Sign-in is unavailable right now. Please try again.';
      setAuthMessage(message);
      return { ok: false, message };
    }

    const pair = await res.json();
    accessTokenRef.current = pair.accessToken;
    writeStoredRefreshToken(pair.refreshToken);

    try {
      await loadMe();
    } catch {
      clearSession();
      const message = 'Signed in, but your profile could not be loaded. Please try again.';
      setAuthMessage(message);
      return { ok: false, message };
    }

    return { ok: true };
  }, [clearSession, loadMe]);

  const signup = useCallback(async (email, password, displayName) => {
    setAuthMessage(null);

    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });

    if (res.status === 201) {
      // Signup issues no tokens, so the new account is signed in with its own credentials.
      return login(email, password);
    }

    const body = await res.json().catch(() => ({}));

    if (res.status === 409) {
      return { ok: false, message: body.error || 'That email address cannot be used for a new account.' };
    }

    if (res.status === 400) {
      return {
        ok: false,
        message: body.error || 'Please check the details you entered.',
        fieldErrors: Array.isArray(body.errors) ? body.errors : []
      };
    }

    return { ok: false, message: 'Account creation is unavailable right now. Please try again.' };
  }, [login]);

  /** R5.10 — both tokens are cleared whatever the endpoint does, and the caller shows the form. */
  const logout = useCallback(async () => {
    try {
      await tokenFetchJson('auth/logout', { method: 'POST' });
    } catch {
      /* deliberately ignored: local session state is cleared either way */
    }

    clearSession();
    setAuthMessage(null);
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    roles,
    isAuthenticated: Boolean(user),
    isAdmin: roles.includes('Admin'),
    restoring,
    authMessage,
    setAuthMessage,
    login,
    signup,
    logout
  }), [user, roles, restoring, authMessage, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.');
  return context;
}
