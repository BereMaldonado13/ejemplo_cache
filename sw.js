 const CACHE_NAME = 'cache-v1';

 self.addEventListener('install', (event) => {
    const preCache = caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                '/index.html',
                '/css/styles.css',
                '/css/bootstrap.min.css',
                '/css/londinium-theme.css',
                '/js/app.js',
                '/offline.html'
            ]);
        });

    event.waitUntil(preCache);

});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                console.log('No existe en cache', event.request.url);

                return fetch(event.request)
                    .then((webResponse) => {
                        return caches.open(CACHE_NAME)
                            .then((cache) => { 
                                cache.put(event.request, webResponse.clone());
                                return webResponse;
                            });
                    });
            })
            .catch((error) => {
                console.error('Fetch error:', error);

                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/offline.html');
                }
            })
    );
});
