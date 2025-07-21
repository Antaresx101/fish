const CACHE_NAME = 'wh-damage-calc-v1';
const urlsToCache = [
  '/dawn/',
  '/dawn/index.html',
  '/dawn/icon.png',
  '/dawn/icon-192x192.png',
  '/dawn/manifest.json',
  '/dawn/icons/inactive.png',
  '/dawn/icons/reroll_1s_hit.png',
  '/dawn/icons/reroll_hits.png',
  '/dawn/icons/fish_for_hits.png',
  '/dawn/icons/sustained_hits_1.png',
  '/dawn/icons/sustained_hits_2.png',
  '/dawn/icons/sustained_hits_3.png',
  '/dawn/icons/sustained_hits_D3.png',
  '/dawn/icons/lethal_hits.png',
  '/dawn/icons/reroll_1s_wounds.png',
  '/dawn/icons/reroll_wounds.png',
  '/dawn/icons/fish_for_wounds.png',
  '/dawn/icons/devastating_wounds.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response
        }
        return fetch(event.request); // Fetch from network
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
