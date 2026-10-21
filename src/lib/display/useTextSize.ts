import { useSyncExternalStore } from 'react';

import {
  DEFAULT_TEXT_SIZE,
  isTextSize,
  TEXT_SIZE_STORAGE_KEY,
  type TextSize,
} from '@/lib/display/textSize';

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// The `<html>` attribute is the source of truth: the inline script in the layout sets it first.
const getSnapshot = (): TextSize => {
  const { textSize } = document.documentElement.dataset;
  return isTextSize(textSize) ? textSize : DEFAULT_TEXT_SIZE;
};

const getServerSnapshot = (): TextSize => DEFAULT_TEXT_SIZE;

export const useTextSize = () => {
  const textSize = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTextSize = (nextSize: TextSize) => {
    document.documentElement.dataset.textSize = nextSize;
    try {
      localStorage.setItem(TEXT_SIZE_STORAGE_KEY, nextSize);
    } catch {
      // Private mode or blocked storage: the size still applies until the page is closed.
    }
    listeners.forEach((listener) => listener());
  };

  return { textSize, setTextSize };
};
