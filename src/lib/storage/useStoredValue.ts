import { useSyncExternalStore } from 'react';

import type { StoredValue } from '@/lib/storage/createStoredValue';

const getServerSnapshot = () => null;

export const useStoredValue = ({ read, subscribe }: StoredValue): string | null =>
  useSyncExternalStore(subscribe, read, getServerSnapshot);
