'use strict';

const CACHE = 'lift-v12';

const FILES = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('lift-') && key !== CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;

  event.respondWith(
    fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();

        event.waitUntil(
          caches.open(CACHE).then(cache =>
            cache.put(request, copy)
          )
        );
      }

      return response;
    }).catch(() => {
      return caches.match(request).then(cached => {
        if (cached) return cached;

        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        return new Response('Offline and resource unavailable.', {
          status: 503,
          headers: {'Content-Type':'text/plain'}
        });
      });
    })
  );
});