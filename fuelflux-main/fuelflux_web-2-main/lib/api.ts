/**
 * api.ts
 * Real Axios client connected directly to the FastAPI backend.
 * Bypasses mock-db completely so all API calls go to the real FastAPI server.
 */

import { backendApi } from './backendApi';

export const api = backendApi;
export default backendApi;

// Token helpers for backwards compatibility
export const getStoredToken = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`fuelflux_${key}`);
  }
  return null;
};

export const setStoredTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fuelflux_accessToken', accessToken);
    localStorage.setItem('fuelflux_refreshToken', refreshToken);
  }
};

export const clearStoredTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fuelflux_accessToken');
    localStorage.removeItem('fuelflux_refreshToken');
    localStorage.removeItem('fuelflux_activeRole');
  }
};

export const decodeFakeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const bodyDecoded = atob(parts[1]);
    return JSON.parse(bodyDecoded);
  } catch (e) {
    return null;
  }
};

export const createFakeJWT = (payload: object, expiresInMinutes = 15): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  const signature = 'fuelflux_token';
  return `${header}.${body}.${signature}`;
};
