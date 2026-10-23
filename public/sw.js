/*
 * Service worker: after the first visit, the app opens and works without internet.
 * - Pages: network first (always the latest version online), saved copy when offline.
 * - Files with a hash in the name (/_next/static) and images: saved copy first, they never change.
 * - Next.js data requests (RSC) go straight to the network; offline, Next.js falls back to a
 *   full page load, which gets the saved page.
 * Plain JavaScript in public/ so it is served as is at /sw.js (see the headers in next.config.ts).
 */
const VERSION = 'v3';
const PAGES_CACHE = `pages-${VERSION}`;
const ASSETS_CACHE = `assets-${VERSION}`;
const PAGES = ['/', '/attendance', '/grades', '/reports', '/labels', '/draw', '/data', '/help'];
const MAX_ASSETS = 300;
const ASSET_URL = /\/_next\/static\/[^"'\s)\\]+/g;

const isAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/reports/') ||
  url.pathname.startsWith('/icons/');

const isNextData = (request, url) => request.headers.has('RSC') || url.searchParams.has('_rsc');

// Old hashed files pile up after each new version of the app; keeps the newest ones.
const trimAssets = async () => {
  const cache = await caches.open(ASSETS_CACHE);
  const keys = await cache.keys();
  await Promise.all(
    keys.slice(0, Math.max(keys.length - MAX_ASSETS, 0)).map((key) => cache.delete(key)),
  );
};

/** Saves the scripts and styles a page needs, so it also works offline before being opened. */
const cacheAssetsOf = async (html) => {
  const cache = await caches.open(ASSETS_CACHE);
  const urls = [...new Set(html.match(ASSET_URL) ?? [])];
  await Promise.all(
    urls.map(async (url) => (await cache.match(url)) || cache.add(url).catch(() => undefined)),
  );
};

const cachePage = async (path) => {
  const response = await fetch(path);
  if (!response.ok) return;
  await (await caches.open(PAGES_CACHE)).put(path, response.clone());
  await cacheAssetsOf(await response.text());
};

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all(PAGES.map((path) => cachePage(path).catch(() => undefined))));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PAGES_CACHE && key !== ASSETS_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const networkFirst = async (request) => {
  const url = new URL(request.url);
  try {
    const response = await fetch(request);
    if (response.ok) {
      (await caches.open(PAGES_CACHE)).put(url.pathname, response.clone());
    }
    return response;
  } catch {
    const cached = (await caches.match(url.pathname)) || (await caches.match('/'));
    return cached || Response.error();
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    await (await caches.open(ASSETS_CACHE)).put(request, response.clone());
    trimAssets();
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || isNextData(request, url)) {
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (isAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
