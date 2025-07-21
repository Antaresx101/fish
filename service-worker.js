const CACHE_NAME = 'wh-damage-calc-v1';
const urlsToCache = [
  '/repository/',
  '/repository/index.html',
  '/repository/icon.png',
  '/repository/icon-192x192.png',
  '/repository/manifest.json',
  '/repository/icons/inactive.png',
  '/repository/icons/reroll_1s_hit.png',
  '/repository/icons/reroll_hits.png',
  '/repository/icons/fish_for_hits.png',
  '/repository/icons/sustained_hits_1.png',
  '/repository/icons/sustained_hits_2.png',
  '/repository/icons/sustained_hits_3.png',
  '/repository/icons/sustained_hits_D3.png',
  '/repository/icons/lethal_hits.png',
  '/repository/icons/reroll_1s_wounds.png',
  '/repository/icons/reroll_wounds.png',
  '/repository/icons/fish_for_wounds.png',
  '/repository/icons/devastating_wounds.png'
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
