import { useSyncExternalStore } from 'react';

import type { HtmlPreference } from '@/lib/display/htmlPreferences';

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Reads and changes a display preference; the `<html>` attribute is the source of truth. */
export const useHtmlPreference = <Value extends string>({
  datasetKey,
  storageKey,
  values,
  defaultValue,
}: HtmlPreference<Value>) => {
  const getSnapshot = (): Value => {
    const current = document.documentElement.dataset[datasetKey];
    return values.includes(current as Value) ? (current as Value) : defaultValue;
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

  const setValue = (nextValue: Value) => {
    document.documentElement.dataset[datasetKey] = nextValue;
    try {
      localStorage.setItem(storageKey, nextValue);
    } catch {
      // Private mode or blocked storage: the choice still applies until the page is closed.
    }
    listeners.forEach((listener) => listener());
  };

  return [value, setValue] as const;
};
