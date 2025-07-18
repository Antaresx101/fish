const CACHE_NAME = 'warhammer-damage-calculator-v1';
const urlsToCache = [
    '/warhammer-damage-calculator/',
    '/warhammer-damage-calculator/index.html',
    '/warhammer-damage-calculator/icon.png'
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
            .then(response => response || fetch(event.request))
    );
});