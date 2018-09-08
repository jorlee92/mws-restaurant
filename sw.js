var CACHE_NAME = 'uda-reviews-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  'http://localhost:1337/restaurants',
  '/manifest.json'
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
  console.log("Caught a fetch")
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {

            return response;
          }
  
          let fetchRequest = event.request.clone();
          console.log("Couldnt find response in cache");
          console.log(event.request);
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