'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import { makeStore } from '@/store';

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(makeStore);

  // Saved state may arrive while parts of the page are still hydrating: read it with usePersistedSelector.
  useEffect(() => {
    const persistor = persistStore(store);
    // Writes are throttled: saves what is pending before the teacher closes or leaves the page.
    const flush = () => void persistor.flush();
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
};
