// Configurações do seu repositório (AGORA COM O NOME CORRETO!)
const GITHUB_OWNER = 'lucaslmcterraplenagem-beep'; 
const GITHUB_REPO = 'Karaz';

let CACHE_NAME = 'karaz-app-v1'; 
const urlsToCache = [
  './app-motorista.html',
  './js/supabase-client.js',
  './logo.png',
  './logo-app.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/main`)
      .then(response => {
        if (!response.ok) throw new Error("API Offline");
        return response.json();
      })
      .then(data => {
        // Se o GitHub retornar o SHA corretamente, usa ele
        if (data && data.sha) {
            const shortSha = data.sha.substring(0, 7);
            CACHE_NAME = `karaz-app-${shortSha}`;
        } else {
            CACHE_NAME = `karaz-app-${Date.now()}`;
        }
        return caches.open(CACHE_NAME);
      })
      .catch(() => {
        // Se a API do GitHub falhar (limite de requisições, etc), usa a data atual como versão
        CACHE_NAME = `karaz-app-${Date.now()}`;
        return caches.open(CACHE_NAME);
      })
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
