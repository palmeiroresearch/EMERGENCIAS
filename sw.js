const CACHE_VERSION = 'emergencias-pro-v1.0.0';
const CACHE_NAME = `emergencias-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './js/app.js',
  './js/calculators.js',
  './js/algorithms.js',
  './icon-192.png',
  './icon-512.png'
];

const DATA_ASSETS = [
  './data/cardiovascular.json',
  './data/paro.json',
  './data/medications.json'
];

// Instalar y cachear
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando archivos estáticos');
        return cache.addAll([...STATIC_ASSETS, ...DATA_ASSETS]);
      })
      .catch(error => {
        console.error('Error al cachear:', error);
      })
  );
});

// Activar y limpiar cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('Eliminando caché vieja:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de fetch
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Network-first para archivos JSON (datos actualizados)
  if (url.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cachear la nueva versión
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si falla, usar caché
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first para todo lo demás
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // No cachear si no es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Cachear la nueva respuesta
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
  );
});
