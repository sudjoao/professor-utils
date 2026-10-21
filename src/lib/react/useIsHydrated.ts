import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` on the server and while React hydrates the component, `true` right after.
 * Lets a component render exactly the server HTML first and only then show browser-only data.
 */
export const useIsHydrated = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
