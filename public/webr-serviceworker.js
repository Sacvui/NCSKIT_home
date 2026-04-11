// WebR Service Worker stub
// WebR uses SharedArrayBuffer channel (channelType 0/1) when COOP/COEP headers are set.
// This file exists to prevent 404 errors during WebR initialization.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
