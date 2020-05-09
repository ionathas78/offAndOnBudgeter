// const _FILES_TO_CACHE = [
//     "/",
//     "icons/icon-192x192.png",
//     "icons/icon-512x512.png",
//     "index.html",
//     "index.js",
//     "manifest.webmanifest",
//     "service-worker.js",
//     "styles.css"
// ];

// const _STATIC_CACHE_NAME = "static-cache-v1";
// const _RUNTIME_CACHE_NAME = "runtime-cache";

// const _INDEXDB_NAME = "budgeter-cache";
// const _INDEXDB_VER = 1;
// const _OBJECTSTORE_NAME = "cached-posts";


// let _db;

// self.addEventListener("install", event => {
//   event.waitUntil(
//     caches
//       .open(_STATIC_CACHE_NAME)
//       .then(cache => cache.addAll(_FILES_TO_CACHE))
//       .then(() => self.skipWaiting())
//   );
// });

// // The activate handler takes care of cleaning up old caches.
// self.addEventListener("activate", event => {
//   const currentCaches = [_STATIC_CACHE_NAME, _RUNTIME_CACHE_NAME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then(cacheNames => {
//         // return array of cache names that are old to delete
//         return cacheNames.filter(
//           cacheName => !currentCaches.includes(cacheName)
//         );
//       })
//       .then(cachesToDelete => {
//         return Promise.all(
//           cachesToDelete.map(cacheToDelete => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

// // self.addEventListener("fetch", event => {
// //   // non GET requests are not cached and requests to other origins are not cached
// //   if (
// //     event.request.method !== "GET" ||
// //     !event.request.url.startsWith(self.location.origin)
// //   ) {
// //     event.respondWith(fetch(event.request));
// //     return;
// //   }

// //   // use cache first for all other requests for performance
// //   event.respondWith(
// //     caches.match(event.request).then(cachedResponse => {
// //       if (cachedResponse) {
// //         return cachedResponse;
// //       }

// //       // request is not in cache. make network request and cache the response
// //       return caches.open(_RUNTIME_CACHE).then(cache => {
// //         return fetch(event.request).then(response => {
// //           return cache.put(event.request, response.clone()).then(() => {
// //             return response;
// //           });
// //         });
// //       });
// //     })
// //   );
// // });

// self.addEventListener('fetch', function(event) {
//     if (!event.request.url.startsWith(self.location.origin)) {
//         event.respondWith(fetch(event.request));
//         return;
//     }
//     if (event.request.method === 'GET') {
//       event.respondWith(
//           fetch(event.request)
//             .then(response => {
//                 caches.open(_RUNTIME_CACHE_NAME)
//                     .then(cache => {
//                         cache.put(event.request, response);
//                         return response;
//                     })
//             })
//             .catch(err => {
//                 console.log(err);
//                 caches.match(event.request)
//                     .then(response => response)
//             })
//       );

//     } else if (event.request.method === 'POST') {
//       event.respondWith(fetch(event.request)
//         .catch(error => {
//             console.log(error);
//             postToDB(event.data.lineItem);
//         }))
//     }
//   });

// self.addEventListener("sync", function(event) {
//     let savedPosts = [];
//     let request = _db.transactions(_OBJECTSTORE_NAME, "readwrite").openCursor();

//     request.onsuccess = async function(event) {
//         let cursor = event.target.result;
//         if (cursor) {
//             savedPosts.push(cursor.value);
//             cursor.continue();
//         } else {
//             savedPosts.forEach(post => {
//                 const { url, method, body } = post;
//                 const headers = {
//                     "Accept": "application/json",
//                     "Content-Type": "application/json"
//                 };

//                 fetch(url, {
//                     headers: headers,
//                     method: method,
//                     body: body
//                 })
//                     .then(response => {
//                         if (response.status === 200) {
//                             _db.transactions(_OBJECTSTORE_NAME, "readwrite").delete(post.id);
//                         }
//                     })
//                     .catch(err => { console.error(err) });
//             });
//         }
//     }
// })

// function openPostingDB () {
//     let indexedDBOpenRequest = indexedDB.open(_INDEXDB_NAME, _INDEXDB_VER);
//     indexedDBOpenRequest.onerror = error => {
//       console.error('IndexedDB error:', error);
//     }
//    indexedDBOpenRequest.onupgradeneeded = function() {
//      this.result.createObjectStore(_OBJECTSTORE_NAME, { autoIncrement:  true, keyPath: 'id' });
//    }
//     indexedDBOpenRequest.onsuccess = function() {
//       _db = this.result;
//     }
//   }

// function postToDB(postData) {
//     let request = _db.transactions(_OBJECTSTORE_NAME, "readwrite")
//         .add(postData);
    
//     request.onsuccess = event => {
//         console.log("Saved to offline cache: " + postData);
//     }

//     request.onerror = error => { console.error(error) };
// }

//   openPostingDB();