const CACHE_NAME = 'bruna-cache-v1';

// Lista de archivos actualizados con tu icon.png
const urlsToCache = [
  './',
  './index.html',
  './barista.html',
  './admin.html',
  './manifest.json',
  './icon.png'
];
// 1. INSTALACIÓN: Guarda los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
  // Fuerza al Service Worker a activarse inmediatamente
  self.skipWaiting(); 
});

// 2. ACTIVACIÓN: Limpia cachés viejos si actualizas la app
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
    })
  );
  self.clients.claim();
});

// 3. FETCH: Sirve los archivos desde el caché si no hay buen internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve el archivo del caché si existe, si no, lo pide a internet
        return response || fetch(event.request);
      })
  );
});
