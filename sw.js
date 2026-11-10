// Mudamos a versão para v4 para forçar o celular a baixar tudo do zero
const CACHE_NAME = 'karaz-app-v4';
const urlsToCache = [
  './app-motorista.html',
  './js/supabase-client.js',
  './logo.png',
  './logo-app.png'
];

self.addEventListener('install', (event) => {
  // Força o novo Service Worker a assumir o controle imediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  // Remove os caches antigos (v1, v2, v3...)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Faz o novo Service Worker controlar todas as abas abertas
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
