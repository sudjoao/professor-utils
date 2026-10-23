'use client';

import { useEffect } from 'react';

/** Registers `public/sw.js` (offline support) in production builds only. */
export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch((error) => console.error(error));
  }, []);

  return null;
};
