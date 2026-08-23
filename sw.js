const CACHE = 'ryb-v4';
const SHELL = ['/', '/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('/feed/data.json') || url.includes('/lyrics/data.json') || url.includes('/beats/data.json') || url.includes('/assets/') || url.includes('/content/')) {
    e.respondWith(fetch(e.request, {cache: 'no-store'}).then(r=>r).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request, {cache: 'no-store'}).then(r=>{
    const clone = r.clone();
    caches.open(CACHE).then(c=>c.put(e.request, clone));
    return r;
  }).catch(()=>caches.match(e.request)));
});
