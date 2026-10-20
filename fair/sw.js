// Service worker for the Canton Fair kiosk: cache first, network as fallback.
// The page fills the cache (assets/js/offline.js); this only answers from it.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // the page's own downloads, and anything with a byte range, go straight to the network
  if (url.searchParams.has('precache') || request.headers.has('range')) return;

  const scope = new URL(self.registration.scope);
  const key = request.mode === 'navigate' || url.pathname === scope.pathname
    ? new URL('index.html', scope).href
    : url.href;

  event.respondWith((async () => {
    const hit = await caches.match(key, { ignoreSearch: true });
    // no-cache stops the browser's memory cache from reusing a file across an
    // update-and-reload, which would mix old and new modules on screen
    if (hit) {
      const headers = new Headers(hit.headers);
      headers.set('Cache-Control', 'no-cache');
      return new Response(hit.body, { status: hit.status, statusText: hit.statusText, headers });
    }
    try {
      return await fetch(request);
    } catch (error) {
      return new Response('Offline and not saved on this tablet yet.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
