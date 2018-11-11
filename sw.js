//For some reason my code couldnt find this from this script, so I am just including it all
var idbKeyval=function(e){'use strict';class t{constructor(e='keyval-store',t='keyval'){this.storeName=t,this._dbp=new Promise((r,n)=>{const o=indexedDB.open(e,1);o.onerror=(()=>n(o.error)),o.onsuccess=(()=>r(o.result)),o.onupgradeneeded=(()=>{o.result.createObjectStore(t);});});}_withIDBStore(e,t){return this._dbp.then(r=>new Promise((n,o)=>{const s=r.transaction(this.storeName,e);s.oncomplete=(()=>n()),s.onabort=s.onerror=(()=>o(s.error)),t(s.objectStore(this.storeName));}));}}let r;function n(){return r||(r=new t),r;}return e.Store=t,e.get=function(e,t=n()){let r;return t._withIDBStore('readonly',t=>{r=t.get(e);}).then(()=>r.result);},e.set=function(e,t,r=n()){return r._withIDBStore('readwrite',r=>{r.put(t,e);});},e.del=function(e,t=n()){return t._withIDBStore('readwrite',t=>{t.delete(e);});},e.clear=function(e=n()){return e._withIDBStore('readwrite',e=>{e.clear();});},e.keys=function(e=n()){const t=[];return e._withIDBStore('readonly',e=>{(e.openKeyCursor||e.openCursor).call(e).onsuccess=function(){this.result&&(t.push(this.result.key),this.result.continue());};}).then(()=>t);},e;}({});
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
			.then(() => console.log('Cached files'))
	);
});

//See https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				if (response) {
					console.log('Found response');
					return response;
				}
  
				let fetchRequest = event.request.clone();
				console.log('Couldnt find response in cache');
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
let uploadLocalData = () => {
	console.log("Syncing");
	let IDs = [];
	//Upload anything that is stored locally
	idbKeyval.keys()
		.then(keys => {
	console.log(keys);
			for(let i = 0; i < keys.length; i++){
				console.log(keys[i]);
				idbKeyval.get(keys[i])
		  .then(results => {
						let keyName = keys[i];
						for(let i = 0; i < results.length; i++){
			  let result = results[i];
			  if(typeof result != (typeof false)){
								if(!result.createdAt){
				  console.log(result);
				  IDs.push(Number(result.restaurant_id));
				  console.log('len' + IDs.length);
				  console.log(IDs[0]);

				  fetch('http://localhost:1337/reviews/', {
										method:'POST',
										body: JSON.stringify({
											'restaurant_id': result.restaurant_id,
											'name': result.name,
											'rating': result.rating,
											'comments' : result.comments
										})
				  }).then(response => {
										console.log(response);
				
				  });
								}
			  }
			  else {
								//It is a favStatus
								//For some reason we never get here, I havent figured out why yet.
								console.log('Sending FavStatus');
								let ID = Number(keyName.split('-')[1]);
								if(result == true){

				  fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=false', {
										method: 'PUT'
				  }).then(result => {
										console.log(result);
										location.reload();
		
				  });
								}
								else {
				  fetch('http://localhost:1337/restaurants/'+ ID + '/?is_favorite=true', {
										method: 'PUT'
				  }).then(result => {
										console.log(result);
										location.reload();
		
				  });
								} 
			  }
						}
		  });
				return true;
	  }})
		.then(() => {
			console.log(IDs);
			//Download a current version of the entry
			for(let i = 0; i < IDs.length; i++){
				let id = IDs[i];
				console.log('Current ID' + id);
				fetch('http://localhost:1337/reviews/?restaurant_id=' + id)
					.then(response => {return response.json();})
					.then(json => {
						console.log('Updating reviews');
						console.log('Storing reviews for location '+ id);
						idbKeyval.set('review-' + id, json);
		  })
		  .catch((error) => {
						console.log('Could not load reviews');
					});
			}
		});
};
// See https://developers.google.com/web/updates/2015/12/background-sync
self.addEventListener('sync', function(event) {
	if (event.tag == 'online') {
		event.waitUntil(uploadLocalData());
	}
	if (event.tag == 'pageLoad') {
		console.log("Page loaded");
	}
});


