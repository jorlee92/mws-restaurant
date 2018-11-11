/* Setup Service Worker */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
          //See https://developers.google.com/web/updates/2015/12/background-sync
        navigator.serviceWorker.ready.then(function(swRegistration) {
          return swRegistration.sync.register('online');
        });
    
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

  fetch('http://localhost:1337/restaurants').then(() => console.log('fetched main json'));