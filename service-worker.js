// Service Worker for Ear Training App
//
// DEVELOPMENT MODE (localhost:8001):
// - Uses network-first strategy for instant updates
// - Edit → Save → Refresh to see changes immediately
// - No need to manually clear cache or unregister service worker
//
// PRODUCTION MODE:
// - Uses cache-first strategy for offline support
// - PWA functionality fully enabled
//
const CACHE_NAME = 'ear-training-v4'; // Force update for audio help features
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/scales.js',
  '/manifest.json'
];

// Install service worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy: network-first for localhost (development), cache-first for production
self.addEventListener('fetch', (event) => {
  const isLocalhost = self.location.hostname === 'localhost' ||
                      self.location.hostname === '127.0.0.1' ||
                      self.location.port === '8001';

  if (isLocalhost) {
    // DEVELOPMENT: Network-first strategy - always get fresh content
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();

          // Update cache with fresh content
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If network fails, fall back to cache
          return caches.match(event.request);
        })
    );
  } else {
    // PRODUCTION: Cache-first strategy - use cached content for offline support
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
        .catch(() => {
          // If both cache and network fail, return offline page
          return caches.match('/index.html');
        })
    );
  }
});
