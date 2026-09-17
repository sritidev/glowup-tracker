// Self Love — minimal service worker
// Enables PWA installability (Chrome requires a fetch handler) and a
// lightweight offline shell. Network-first so users always get fresh data.

const CACHE = "myaura-v2";
const PRECACHE = ["/dashboard", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const url = new URL(request.url);

  // Only handle same-origin GET requests; let Supabase/auth calls pass through
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // NEVER cache API routes (Pinterest auth + private data) — always hit network
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Network-first, fall back to cache when offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/dashboard")))
  );
});
