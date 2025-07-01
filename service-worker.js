self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', function(event) {
  const newHeaders = new Headers();
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Copy the original headers and add COOP/COEP
        response.headers.forEach((value, key) => {
          newHeaders.set(key, value);
        });
        newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
        newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

        return response.blob().then(body => new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        }));
      })
  );
});
