self.addEventListener('install', e => {
  e.waitUntil(caches.open('ryb-v1').then(c => c.addAll(['/','/feed/','/lyrics/','/beats/'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
