import { useSyncExternalStore } from 'react';

import { getTodayIsoDate, type IsoDate } from '@/lib/date/isoDate';

const subscribe = () => () => undefined;
const getServerSnapshot = () => null;

/**
 * Today's date, read only in the browser: the server does not know the teacher's time zone,
 * and reading the clock while prerendering breaks the build. Returns `null` until hydration.
 */
export const useToday = (): IsoDate | null =>
  useSyncExternalStore(subscribe, getTodayIsoDate, getServerSnapshot);
