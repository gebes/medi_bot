'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "android-icon-144x144.png": "bb2bfe4d2d7758181c87f27b1f01fa1c",
"android-icon-192x192.png": "3bf31f8c145d14468a5ce223c4833a2d",
"android-icon-36x36.png": "4eae6c968c53c79a2e6567aeb73c2036",
"android-icon-48x48.png": "48aa9dd72a6fc65a3aaa62fdb239192c",
"android-icon-72x72.png": "a91f29f40eb87259ed574a75dbfc1232",
"android-icon-96x96.png": "2b728d06900b7642422a26e72bf24a38",
"apple-icon-114x114.png": "4c1d88f30e0f52d0269341c250231e2b",
"apple-icon-120x120.png": "2effa57c435f9a6fd89166c84b87544c",
"apple-icon-144x144.png": "bb2bfe4d2d7758181c87f27b1f01fa1c",
"apple-icon-152x152.png": "c8be7a387e707a0747978a3363e793b6",
"apple-icon-180x180.png": "e1c3bc84491c31df8f186933ca0e74b6",
"apple-icon-57x57.png": "7f9389de691292ca7fc4b2485e5486a3",
"apple-icon-60x60.png": "cc2ebd9b4f66c06d743a7a084fde7c62",
"apple-icon-72x72.png": "a91f29f40eb87259ed574a75dbfc1232",
"apple-icon-76x76.png": "adcaf6c4f4fa49e0b8dfa0de795991ae",
"apple-icon-precomposed.png": "2c24a8440836de52a1be545174a5907d",
"apple-icon.png": "2c24a8440836de52a1be545174a5907d",
"assets/AssetManifest.json": "f781bd8ca3ee2dc21f6adf2d721f276b",
"assets/assets/dialog.txt": "6697a3ef405a069672b96e8c0c245f02",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "becf7f021c8d8e4207f93b2b4910476b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"favicon-16x16.png": "d9ad11fb31ba7af24c01dca49ba5c5dc",
"favicon-32x32.png": "f7e583615e0e6f4d998229bf6e0036b8",
"favicon-96x96.png": "2b728d06900b7642422a26e72bf24a38",
"favicon.ico": "00efc5379d09ce26b60a1482f14fc184",
"index.html": "5c47477e03225908399934d063b30502",
"/": "5c47477e03225908399934d063b30502",
"main.dart.js": "71a8f2b446f781df80c06a9b2a0fdd2d",
"manifest.json": "1bf4a68e2182d0f2b5c2b8c3774c5b10",
"ms-icon-144x144.png": "bb2bfe4d2d7758181c87f27b1f01fa1c",
"ms-icon-150x150.png": "06cc5a6492a40427958424add1a9c92b",
"ms-icon-310x310.png": "f3abe7cbddc0387cca45b9c030fab7dd",
"ms-icon-70x70.png": "46dc2d59c4603917944b898d7bcd6d01",
"version.json": "d08b536e518884e23673ea24ffb4273a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
