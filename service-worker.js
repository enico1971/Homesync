// Minimaler Service Worker — nur fürs "Zum Home-Bildschirm hinzufügen".
// Cached die App-Hülle (HTML/CSS/JS liegen alle in index.html), nicht die
// Supabase-Daten — die App braucht ohnehin eine Internetverbindung für den Sync.
const CACHE_NAME = 'homesync-shell-v1';
const SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Netzwerk zuerst (für Live-Daten/Supabase), bei Fehler auf Cache zurückfallen.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
