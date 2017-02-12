(function() {
  const api = "https://randomuser.me/api/?format=json";

  document.addEventListener("DOMContentLoaded", () => {
    const cache      = document.getElementById("cache");
    const latest     = document.getElementById("latest");
    cache.innerHTML  = "grabbing cache...";
    latest.innerHTML = "grabbing response...";

    if("caches" in window){
      caches.match(api)
        .then((res) => res.json())
        .then((data) => {
          const name = data.results[0].name;
          console.log(name);
          cache.innerHTML = `${name.title} ${name.first} ${name.last}`;
        })
        .catch((err) => {
          cache.innerHTML = "oops something went wrong";
        });
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      const data = JSON.parse(xhr.response);
      const name = data.results[0].name;
      latest.innerHTML = `${name.title} ${name.first} ${name.last}`;
    });
    xhr.addEventListener("error", () => {
      latest.innerHTML = "oops something went wrong";
    });
    xhr.open("GET", api);
    xhr.send();
  });

  if("serviceWorker" in navigator){
    navigator.serviceWorker
             .register("./sw.js")
             .then((registration) => {
               console.log("[Service Worker] Registered with scope: " + registration.scope);
             });
  }
})();
