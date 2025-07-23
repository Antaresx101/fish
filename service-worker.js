const VERSION_PARAM = new URLSearchParams(self.location.search).get('v') || '1';
const CACHE_NAME = `wh-damage-calc-v${VERSION_PARAM}`;
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/icon-192x192.png',
    '/icons/inactive.png',
    '/icons/reroll_1s_hit.png',
    '/icons/reroll_hits.png',
    '/icons/fish_for_hits.png',
    '/icons/sustained_hits_1.png',
    '/icons/sustained_hits_2.png',
    '/icons/sustained_hits_3.png',
    '/icons/sustained_hits_D3.png',
    '/icons/lethal_hits.png',
    '/icons/reroll_1s_wounds.png',
    '/icons/reroll_wounds.png',
    '/icons/fish_for_wounds.png',
    '/icons/devastating_wounds.png'
];

// Install event: Cache initial resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache.map(url => `${url}?v=${VERSION_PARAM}`));
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: Use network-first for HTML and manifest, cache-first for other resources
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Network-first for index.html and manifest.json
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/manifest.json') {
        event.respondWith(
            fetch(`${event.request.url}?v=${VERSION_PARAM}`)
                .then(response => {
                    // Cache the new response
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-first for other resources (e.g., images)
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(`${event.request.url}?v=${VERSION_PARAM}`).then(networkResponse => {
                        // Cache the new response
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                })
                .catch(() => {
                    // Optional: Handle offline fallback for non-critical resources
                    return caches.match('/icons/inactive.png');
                })
        );
    }
});
