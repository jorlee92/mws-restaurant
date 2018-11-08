var CACHE_NAME = 'uda-reviews-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  'http://localhost:1337/restaurants',
  '/manifest.json',
  '/js/idb.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => console.log("Cached files"))
  );
});

//See https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', function(event) {

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            console.log("Found response");
            return response;
          }
  
          let fetchRequest = event.request.clone();
          console.log("Couldnt find response in cache");
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });
  // See https://developers.google.com/web/updates/2015/12/background-sync
  self.addEventListener('sync', function(event) {
    if (event.tag == 'myFirstSync') {
      event.waitUntil(console.log('myFirstSync'));
    }
  });
  