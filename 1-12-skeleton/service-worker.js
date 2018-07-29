var dataCacheName = 'weatherData-final';
var cacheName = 'weatherPWA-dtep-final-1';
var fileToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/scripts/localforage-1.7.1/dist/localforage.js',
    '/styles/ud811.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install' , function(e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] is caching App shell');
            return cache.addAll(fileToCache);
        })
    );
});
 
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(
            function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache');
                        return caches.delete(key);
                    }
                }));
            })
    )
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.result.url);
    if (e.request.url.start(dataUrl)) {
        e.respondWith(
            fetch(e.request)
            .then(function(response) {
                return caches.open(dataCacheName).then(function(cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetch&Cached Data');
                    return response;
                })
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response){
                return response || fetch(e.request);
            });
        );
    }
});

onfetch = function (e) {
    var url = e.request.url;
    if(url == "app.html") {
        e.respondWith(
            caches.match(e.request)
        );
    }

    if(url == "content.json") {
        // got to the network for updates
        // then cache response and return

        e.respondWith(
            fetch(...).then(function(r){
                cache.put(url, r.clone());
                return r;
            })
        );
    }
  }


 