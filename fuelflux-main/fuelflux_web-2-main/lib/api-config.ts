/**
 * api-config.ts
 * Centralized API and environment configuration for FuelFlux.
 * 
 * Single source of truth for backend communication across all Axios clients,
 * fetch calls, and static asset links.
 */

export const PRODUCTION_API_URL = 'https://fuelflux-admin.onrender.com/api/v1';
export const LOCAL_DEV_API_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * Determines whether the code is running in a production environment.
 * Checks both Next.js build-time NODE_ENV and browser runtime hostname.
 */
export function isProductionEnvironment(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return (
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      !hostname.endsWith('.local') &&
      !hostname.includes('192.168.') &&
      !hostname.includes('10.')
    );
  }
  return false;
}

/**
 * Normalizes an API base URL:
 * - Trims whitespace
 * - Strips trailing slashes
 * - Guarantees the `/api/v1` suffix
 */
export function normalizeApiUrl(rawUrl: string): string {
  let url = rawUrl.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

/**
 * Derives the backend root URL (without `/api/v1` suffix) for static assets,
 * uploads, receipts, and logos.
 */
export function deriveBackendBaseUrl(apiUrl: string): string {
  return apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
}

/**
 * Resolves the active API base URL in a safe, environment-aware manner.
 * 
 * Rules:
 * 1. If `NEXT_PUBLIC_API_URL` is set:
 *    - In production, rejects any values pointing to localhost/127.0.0.1 with a clear configuration error.
 *    - Normalizes and returns the URL.
 * 2. In production without `NEXT_PUBLIC_API_URL`:
 *    - Displays a clear configuration warning in console.
 *    - Safely uses `PRODUCTION_API_URL` (https://fuelflux-admin.onrender.com/api/v1) instead of localhost.
 * 3. In development without `NEXT_PUBLIC_API_URL`:
 *    - Uses `LOCAL_DEV_API_URL` (http://127.0.0.1:8000/api/v1).
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isProd = isProductionEnvironment();

  if (envUrl) {
    const isLocalhostTarget =
      envUrl.includes('localhost') ||
      envUrl.includes('127.0.0.1') ||
      envUrl.includes('0.0.0.0');

    if (isProd && isLocalhostTarget) {
      console.error(
        '[FuelFlux Config Error] NEXT_PUBLIC_API_URL is configured to localhost in a production environment! ' +
          'Requests to localhost will fail with ERR_CONNECTION_REFUSED. ' +
          'Automatically redirecting API requests to production backend: ' +
          PRODUCTION_API_URL
      );
      return PRODUCTION_API_URL;
    }

    return normalizeApiUrl(envUrl);
  }

  // If no environment variable is provided:
  if (isProd) {
    console.warn(
      '[FuelFlux Config Notice] NEXT_PUBLIC_API_URL is missing in production environment variables. ' +
        'Please add NEXT_PUBLIC_API_URL=' +
        PRODUCTION_API_URL +
        ' to your Vercel Project Settings. ' +
        'Defaulting safely to production backend: ' +
        PRODUCTION_API_URL
    );
    return PRODUCTION_API_URL;
  }

  // Development environment default
  return LOCAL_DEV_API_URL;
}

/** Active API base URL (e.g. "https://fuelflux-admin.onrender.com/api/v1") */
export const API_BASE_URL: string = getApiBaseUrl();

/** Active Backend root URL (e.g. "https://fuelflux-admin.onrender.com") */
export const BACKEND_BASE_URL: string = deriveBackendBaseUrl(API_BASE_URL);

/**
 * Constructs an API endpoint URL safely preventing duplicate `/api/v1` prefixes.
 * 
 * Example:
 * buildApiUrl('/auth/login')            -> "https://fuelflux-admin.onrender.com/api/v1/auth/login"
 * buildApiUrl('auth/login')             -> "https://fuelflux-admin.onrender.com/api/v1/auth/login"
 * buildApiUrl('/api/v1/auth/login')     -> "https://fuelflux-admin.onrender.com/api/v1/auth/login"
 */
export function buildApiUrl(endpoint: string): string {
  let cleanPath = endpoint.trim();
  // Strip duplicate /api/v1 if accidentally included in endpoint argument
  cleanPath = cleanPath.replace(/^\/?api\/v1\/?/, '');
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Constructs an absolute URL for a static asset or upload (logo, receipt, document).
 * Strips `/api/v1` from the server root so static files are served directly.
 * 
 * Example:
 * buildAssetUrl('/uploads/logos/pump_1.png') -> "https://fuelflux-admin.onrender.com/uploads/logos/pump_1.png"
 * buildAssetUrl('https://example.com/pic.jpg') -> "https://example.com/pic.jpg"
 */
export function buildAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${cleanPath}`;
}
