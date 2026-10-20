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

  // Rehydrating after mount keeps the first client render identical to the server HTML.
  useEffect(() => {
    persistStore(store);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
};
