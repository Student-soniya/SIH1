// Single-flight token refresh and bearer-header discipline (R5.5, R5.6, design C12).
//
// Two module-level facts make the guarantees hold:
//
//   * `accessTokenAccessor` — the access token lives in an AuthContext `useRef`, never in
//     localStorage. This module reads it through an accessor so there is exactly one copy.
//   * `refreshPromise` — one in-flight refresh call, shared by every request that got a 401
//     inside that window. Ten concurrent 401s cause one refresh, not ten, and each original
//     request is retried exactly once.

export const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

/** Instant 300ms refresh timeout: Prevents UI blocking when backend is offline or slow */
const REFRESH_TIMEOUT_MS = 300;

const REFRESH_TOKEN_STORAGE_KEY = 'schemeready.refreshToken';

/**
 * The endpoints of R4.16, which take no Access_Token. Everything else is protected, so the
 * default is "attach the header" — a new endpoint is protected unless it is listed here.
 * Compared against the path after `API_BASE`.
 */
const ANONYMOUS_PATHS = [
  'onboarding/extract',
  'schemes',
  'schemes/match',
  'partners',
  'partners/route',
  'emi/calculate',
  'business-plan/generate',
  'businessplan/generate',
  'auth/signup',
  'auth/login',
  'auth/refresh'
];

/** Thrown by every protected-endpoint call that fails. No fabricated data ever replaces it (R5.11). */
export class ApiError extends Error {
  constructor(message, status, path) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }
}

let accessTokenAccessor = () => null;
let applyAccessToken = () => {};
let onAuthLost = () => {};
let refreshPromise = null;

/** Wires this module to the AuthContext's in-memory ref and its session-lost handler. */
export function configureTokenFetch({ getAccessToken, setAccessToken, onSessionLost }) {
  accessTokenAccessor = getAccessToken;
  applyAccessToken = setAccessToken;
  onAuthLost = onSessionLost || (() => {});
}

export function readStoredRefreshToken() {
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;                       // private-mode or storage-disabled browsers
  }
}

export function writeStoredRefreshToken(token) {
  try {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    /* storage unavailable: the session simply will not survive a reload */
  }
}

export function clearStoredRefreshToken() {
  writeStoredRefreshToken(null);
}

/** `true` when the path needs an `Authorization` header. Longest-prefix agnostic: exact match on
 *  the path, with the query string stripped. */
export function isAnonymousPath(path) {
  const clean = String(path || '').split('?')[0].replace(/^\/+/, '');

  if (ANONYMOUS_PATHS.includes(clean)) return true;

  // `schemes/{id}` is anonymous; `schemes/match` is already listed above.
  if (/^schemes\/[^/]+$/.test(clean)) return true;

  return false;
}

/**
 * Exchanges the stored refresh token for a new pair. Shared: concurrent callers await the same
 * promise, so the refresh endpoint is called once (R5.6).
 */
export function refreshSession() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const stored = readStoredRefreshToken();
    if (!stored) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored }),
        signal: controller.signal
      });

      if (!res.ok) {
        // R5.7 — a 401 from refresh means the session ended: discard both tokens.
        clearStoredRefreshToken();
        applyAccessToken(null);
        onAuthLost('session-ended');
        return null;
      }

      const pair = await res.json();
      applyAccessToken(pair.accessToken);
      writeStoredRefreshToken(pair.refreshToken);
      return pair;
    } catch {
      // Abort (10 s) or network failure both count as a failed refresh.
      clearStoredRefreshToken();
      applyAccessToken(null);
      onAuthLost('session-ended');
      return null;
    } finally {
      clearTimeout(timer);
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * `fetch` for the SchemeReady API.
 *
 * Attaches the bearer header only for protected endpoints (R5.5). On a 401 from a protected
 * endpoint it joins the single in-flight refresh and retries the original request exactly once
 * — never a second refresh and never a second retry (R5.6).
 */
export async function tokenFetch(path, options = {}) {
  const anonymous = isAnonymousPath(path);

  const send = () => {
    const headers = { ...(options.headers || {}) };

    if (!anonymous) {
      const token = accessTokenAccessor();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}/${String(path).replace(/^\/+/, '')}`, { ...options, headers });
  };

  let response = await send();

  if (response.status === 401 && !anonymous) {
    const pair = await refreshSession();
    if (!pair) return response;                 // refresh failed: surface the 401 unchanged

    response = await send();                    // exactly one retry
  }

  return response;
}

/**
 * `tokenFetch` plus the R5.11 contract: a protected endpoint either yields parsed JSON or
 * throws. It never returns a fabricated body, so a caller cannot mistake offline filler for
 * persisted data.
 */
export async function tokenFetchJson(path, options = {}) {
  const response = await tokenFetch(path, options);

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error || (Array.isArray(body?.errors) ? body.errors.join(' ') : '');
    } catch {
      /* a 404 from an ownership denial has an empty body by design */
    }

    throw new ApiError(detail || `Request to ${path} failed with status ${response.status}.`, response.status, path);
  }

  if (response.status === 204) return null;

  return response.json();
}
