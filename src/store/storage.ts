import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import type { WebStorage } from 'redux-persist/es/types';

const createNoopStorage = (): WebStorage => ({
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
});

const isServer = typeof window === 'undefined';

// localStorage does not exist during SSR, so the server gets a storage that does nothing.
export const storage: WebStorage = isServer ? createNoopStorage() : createWebStorage('local');
