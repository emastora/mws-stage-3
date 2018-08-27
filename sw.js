console.log("Hello Service Worker!");

const version = 15;
const appCacheName = `cache-v${version}`;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(appCacheName).then(function(cache) {
            console.log('Service Worker installed');
            return cache.addAll([
                './',
                'index.html',
                'restaurant.html',
                'manifest.json',
                'buildTool/js/app.js',
                'buildTool/js/dbhelper.js',
                'buildTool/js/main.js',
                'buildTool/js/restaurant_info.js',
                'buildTool/js/idb.js',
                'buildTool/css/main.css',
                'assets/icons/favicon.ico',
                'buildTool/img/1.jpg',
                'buildTool/img/2.jpg',
                'buildTool/img/3.jpg',
                'buildTool/img/4.jpg',
                'buildTool/img/5.jpg',
                'buildTool/img/6.jpg',
                'buildTool/img/7.jpg',
                'buildTool/img/8.jpg',
                'buildTool/img/9.jpg',
                'buildTool/img/10.jpg',
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (appCacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(function(response) {
                    return response;
                }).catch(function(error) {
                    throw error;
                });
            }).catch(function() {
                return new Response('No cache items');
            })
        );
    }

});