/**
 * A text value kept in its own `localStorage` key, outside Redux: right for big values (like
 * an image) that would otherwise be written again with every change of the rest of the state.
 * The value is read from the browser once and then served from memory.
 */
export const createStoredValue = (storageKey: string) => {
  let cachedValue: string | null | undefined;
  const listeners = new Set<() => void>();

  const read = (): string | null => {
    if (cachedValue === undefined) {
      try {
        cachedValue = localStorage.getItem(storageKey);
      } catch {
        cachedValue = null;
      }
    }
    return cachedValue;
  };

  /** Returns `false` when the browser refused to keep it (storage full or blocked). */
  const write = (value: string | null): boolean => {
    cachedValue = value;
    listeners.forEach((listener) => listener());

    try {
      if (value === null) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, value);
      }
      return true;
    } catch {
      return false;
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { read, write, subscribe };
};

export type StoredValue = ReturnType<typeof createStoredValue>;
