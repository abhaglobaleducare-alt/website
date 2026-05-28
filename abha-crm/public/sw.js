// Minimal service worker — enables PWA installability and offline navigation fallback.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the network handle navigations and API calls; no aggressive caching.
  if (event.request.mode === 'navigate') {
    return;
  }
});
