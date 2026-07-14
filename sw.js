const PDF_CACHE = 'prontuario-pdf-v1';
const PDF_PATH = 'public/Analise-Facial-F83f9B8r.pdf';

const getPdfUrl = () => new URL(PDF_PATH, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PDF_CACHE)
      .then((cache) => cache.add(getPdfUrl()))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('prontuario-pdf-') && cacheName !== PDF_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url !== getPdfUrl()) return;

  event.respondWith(
    caches.open(PDF_CACHE).then(async (cache) => {
      const cachedPdf = await cache.match(event.request, { ignoreSearch: true });
      if (cachedPdf) return cachedPdf;

      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    })
  );
});
