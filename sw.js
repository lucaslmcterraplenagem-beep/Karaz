// Configurações do seu repositório
const GITHUB_OWNER = 'lucasmcterraplenagem-beep';
const GITHUB_REPO = 'Karaz';

let CACHE_NAME = 'karaz-app-v1'; // Valor inicial de segurança
const urlsToCache = [
  './app-motorista.html',
  './js/supabase-client.js',
  './logo.png',
  './logo-app.png'
];

// Instalação: Busca a versão mais recente no GitHub para usar como nome do Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/main`)
      .then(response => response.json())
      .then(data => {
        // Pega os 7 primeiros caracteres do hash do commit (ex: "a1b2c3d")
        const shortSha = data.sha.substring(0, 7);
        CACHE_NAME = `karaz-app-${shortSha}`; // Ex: karaz-app-a1b2c3d
        return caches.open(CACHE_NAME);
      })
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativação: Limpa os caches antigos e assume o controle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Apaga versões antigas
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
