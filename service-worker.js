self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('rectangle-area-cache').then(function(cache) {
      return cache.addAll([
        'index.html',
        'rectangle.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('message', event => {
  if (event.data === 'getRectangleArea') {
    let length = 5;
    let width = 10;
    getRectangleArea(length, width).then(area => {
      localStorage.setItem('area', area);
      event.source.postMessage('areaCalculated');
    });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      registration.active.postMessage('getRectangleArea');
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });

  
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data === 'areaCalculated') {
      document.getElementById("area").innerHTML = `The area of the rectangle is ${localStorage.getItem('area')} square units.`;
    }
  });
}