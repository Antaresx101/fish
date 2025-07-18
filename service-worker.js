self.addEventListener('install', event => {
         event.waitUntil(
             caches.open('dawn-v1').then(cache => {
                 return cache.addAll([
                     '/',
                     '/index.html',
                     '/icon.png',
                     '/manifest.json',
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
                 ]);
             })
         );
     });

     self.addEventListener('fetch', event => {
         event.respondWith(
             caches.match(event.request).then(response => {
                 return response || fetch(event.request);
             })
         );
     });