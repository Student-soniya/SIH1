// Shared fetch helper for SchemeReady API requests.
// The backend exposes authenticated document upload, listing, retrieval and deletion endpoints.

const configuredBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? String(import.meta.env.VITE_API_BASE_URL).trim()
  : '';

export const API_BASE = configuredBase || 'http://localhost:5000/api';
const REFRESH_TOKEN_STORAGE_KEY = 'schemeready.refreshToken';
const REFRESH_TIMEOUT_MS = 5000;

const ANONYMOUS_PATHS = [
  'onboarding/extract', 'schemes', 'schemes/match', 'partners', 'partners/route',
  'emi/calculate', 'business-plan/generate', 'businessplan/generate',
  'auth/signup', 'auth/login', 'auth/refresh'
];

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

export function configureTokenFetch({ getAccessToken, setAccessToken, onSessionLost }) {
  accessTokenAccessor = getAccessToken;
  applyAccessToken = setAccessToken;
  onAuthLost = onSessionLost || (() => {});
}

export function readStoredRefreshToken() {
  try { return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY); } catch { return null; }
}

export function writeStoredRefreshToken(token) {
  try {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {}
}

export function clearStoredRefreshToken() { writeStoredRefreshToken(null); }

export function isAnonymousPath(path) {
  const clean = String(path || '').split('?')[0].replace(/^\/+/, '');
  return ANONYMOUS_PATHS.includes(clean) || /^schemes\/[^/]+$/.test(clean);
}

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
    if (!pair) return response;
    response = await send();
  }
  return response;
}

export async function tokenFetchJson(path, options = {}) {
  const response = await tokenFetch(path, options);
  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error || (Array.isArray(body?.errors) ? body.errors.join(' ') : '');
    } catch {}
    throw new ApiError(detail || `Request to ${path} failed with status ${response.status}.`, response.status, path);
  }
  if (response.status === 204) return null;
  return response.json();
}
