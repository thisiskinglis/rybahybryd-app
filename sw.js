const CACHE = 'ryb-v3'; // bumped from v1 -> v3 forces cache clear
const SHELL = ['/', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // NEVER cache data.json or your media - always go to network
  if (url.includes('/feed/data.json') || url.includes('/assets/') || url.includes('/content/')) {
    e.respondWith(
      fetch(e.request, {cache: 'no-store'})
        .then(r => r)
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // For pages, try network first, then fall back to cache
  e.respondWith(
    fetch(e.request, {cache: 'no-store'})
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
