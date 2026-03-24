const CACHE_NAME = "kimi-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.html",
  "/Images/LOGO.png",
  "/Images/BG.png"
];

// install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});