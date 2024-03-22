const CACHE_NAME = 'ecommerce-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // Add other URLs you want to cache
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.filter((name) => {
                        return name !== CACHE_NAME;
                    }).map((name) => {
                        return caches.delete(name);
                    })
                );
            })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('fetch event triggered');
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
self.addEventListener('sync', function(event) {
    console.log('Sync successful');
    if (event.tag === 'syncData') {
      event.waitUntil(syncDataWithServer());
    }
  });
  
// Function to synchronize data with the server
function syncDataWithServer() {
return new Promise(function(resolve, reject) {
    fetch('/syncData')
    .then(function(response) {
        if (!response.ok) {
        throw new Error('Failed to synchronize data with server');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Data synchronized successfully:', data);
        resolve();
    })
    .catch(function(error) {
        console.error('Failed to synchronize data:', error);
        reject();
    });
});
}

self.addEventListener('push', function(event) {
    const options = {
      body: 'Your wishlisted HP laptop was restocked!',
      icon: 'logolaptop.jpeg'
    };
  
    event.waitUntil(
      self.registration.showNotification('New notification', options)
    );
  });
  
  
  
  
