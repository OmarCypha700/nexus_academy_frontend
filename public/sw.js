// Minimal service worker whose only job is to make the app installable as a PWA.
// Deliberately does not cache anything or intercept fetches — offline support is a
// separate, larger piece of work and isn't implemented here. Every request falls through to
// normal network handling untouched.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // No-op: not calling event.respondWith() lets the browser handle the request normally.
});
