const PRONTUARIO_CACHE = 'prontuario-images-v2';
const PRONTUARIO_PATHS = Array.from(
  { length: 20 },
  (_, index) => `public/prontuario/pagina-${String(index + 1).padStart(2, '0')}.jpg`
);

const getProntuarioUrls = () => PRONTUARIO_PATHS.map(
  (path) => new URL(path, self.registration.scope).href
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRONTUARIO_CACHE)
      .then((cache) => cache.addAll(getProntuarioUrls()))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => (
            cacheName.startsWith('prontuario-pdf-') || cacheName.startsWith('prontuario-images-')
          ) && cacheName !== PRONTUARIO_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !getProntuarioUrls().includes(event.request.url)) return;

  event.respondWith(
    caches.open(PRONTUARIO_CACHE).then(async (cache) => {
      const cachedImage = await cache.match(event.request, { ignoreSearch: true });
      if (cachedImage) return cachedImage;

      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    })
  );
});
