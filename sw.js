const CACHE_NAME = "kimi-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/Images/LOGO.png",
  "/Images/BG.png",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
  "https://kit.fontawesome.com/f1f723bf20.js",
  "https://code.jquery.com/jquery-3.6.0.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});