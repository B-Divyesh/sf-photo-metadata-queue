const VERSION = 'caption-queue-v4';
const SHELL = ['/', '/index.html', '/demo', '/offline.html', '/404.html', '/manifest.webmanifest', '/assets/icon.svg', '/assets/field-desk.webp', '/assets/field-desk-mobile.webp', '/assets/social-card.jpg', '/assets/404.css', '/assets/offline.css'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL))));
self.addEventListener('activate', (event) => event.waitUntil(Promise.all([caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))), self.clients.claim()])));
self.addEventListener('message', (event) => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => { if (response.ok) { const copy=response.clone();caches.open(VERSION).then((cache)=>cache.put('/index.html',copy)); } return response; }).catch(() => caches.match('/index.html').then((response) => response || caches.match('/offline.html')))); return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { if (response.ok) { const copy=response.clone();caches.open(VERSION).then((cache)=>cache.put(event.request,copy)); } return response; })));
});
