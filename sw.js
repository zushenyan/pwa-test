(function() {
  const CACHE_DATA_NAME  = "foobar-data-v1";
  const CACHE_SHELL_NAME = "foobar-shell-v1";
  const CACHE_FILES = [
    "/",
    "/index.html",
    "/app.js"
  ];
  const CACHE_API = [
    "https://randomuser.me/api/?format=json"
  ];

  self.addEventListener("install", (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
      caches.open(CACHE_SHELL_NAME)
            .then((cache) => {
              console.log("[ServiceWorker] Caching app shell");
              return cache.addAll(CACHE_FILES);
            })
            .then(() => self.skipWaiting())
    );
  });

  self.addEventListener("activate", (e) => {
    console.log("[ServiceWorker] Activate");
    e.waitUntil(
      caches.keys()
            .then((keyList) =>
              Promise.all(
                keyList.map((key) => {
                  if (key !== CACHE_SHELL_NAME && key !== CACHE_DATA_NAME) {
                    console.log("[ServiceWorker] Removing old cache", key);
                    return caches.delete(key);
                  }
                })
              )
            )
    );
    return self.clients.claim();
  });

  self.addEventListener("fetch", (e) => {
    console.log("[ServiceWorker] Fetch", e.request.url);
    if(CACHE_API.includes(e.request.url)){
      e.respondWith(
        caches.open(CACHE_DATA_NAME)
              .then((cache) => {
                return fetch(e.request).then((res) => {
                  console.log(res);
                  cache.put(e.request.url, res.clone());
                  return res;
                });
              })
      );
    }
    else {
      e.respondWith(
        caches.match(e.request)
              .then((response) => response || fetch(e.request))
      );
    }
  });

})();
