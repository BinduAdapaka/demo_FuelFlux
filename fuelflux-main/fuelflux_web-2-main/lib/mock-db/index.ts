/**
 * mock-db/index.ts
 * DEPRECATED: FuelFlux is connected directly to the real FastAPI backend.
 * All types are now re-exported from @/types/domain.
 * Mock database storage has been disabled.
 */

export * from '@/types/domain';

// Safety stub in case any unmigrated reference attempts to access mockDb
export const mockDb = {
  get: () => {
    console.warn('[FuelFlux] Mock DB is disabled. All data is fetched from FastAPI backend.');
    return null;
  },
  set: () => {
    console.warn('[FuelFlux] Mock DB is disabled. All data is saved to FastAPI backend.');
  },
};

export const db = mockDb;
export default mockDb;
