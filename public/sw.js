// const CACHE_NAME = "offline-cache-v1";
const CACHE_NAME = "offline-cache-v2";
const OFFLINE_ASSETS = [
  "/offline/mark1.png",
  "/offline/mark2.png",
  "/offline/mark3.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
