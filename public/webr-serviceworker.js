// WebR Service Worker stub
// WebR uses PostMessage channel (channelType 3). 
// This file exists to prevent 404 errors during WebR initialization.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
