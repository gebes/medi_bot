'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "android-icon-144x144.png": "0878541f982b579da49f699977f4a9b9",
"android-icon-192x192.png": "47c5d21ce0825ee0571e8351c53e7c03",
"android-icon-36x36.png": "4540b9f83d8dce970b44c89680c266a9",
"android-icon-48x48.png": "fe358bf8f1ad56c00326d0eb72e045e6",
"android-icon-72x72.png": "1d31502d00eac1084dcf9365e4b79f80",
"android-icon-96x96.png": "54ee833a82af911f0c95e018e63c5901",
"apple-icon-114x114.png": "f9619282dff2b965fb273e55de51ea22",
"apple-icon-120x120.png": "081fa9dbe00479790a1e26d15a3f3cde",
"apple-icon-144x144.png": "0878541f982b579da49f699977f4a9b9",
"apple-icon-152x152.png": "f26d51ae8cbc85a08204d349df31d18a",
"apple-icon-180x180.png": "7d0cde6704299aae451f99f9df9fabb6",
"apple-icon-57x57.png": "566d3a5b87e7b57c5da71f8367e61c99",
"apple-icon-60x60.png": "9c2d2a6efbc0a0597c62ada724b28cd6",
"apple-icon-72x72.png": "1d31502d00eac1084dcf9365e4b79f80",
"apple-icon-76x76.png": "5a29e8472cff2df192bc8e5fd0627d9a",
"apple-icon-precomposed.png": "cc83dc8c23175e355e505a629634a764",
"apple-icon.png": "cc83dc8c23175e355e505a629634a764",
"assets/AssetManifest.json": "f781bd8ca3ee2dc21f6adf2d721f276b",
"assets/assets/dialog.txt": "6697a3ef405a069672b96e8c0c245f02",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "becf7f021c8d8e4207f93b2b4910476b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"favicon-16x16.png": "8601b0504b19c4baf3085f80b4468eff",
"favicon-32x32.png": "2db676297abbfd0f68d8dcd119c9ef52",
"favicon-96x96.png": "54ee833a82af911f0c95e018e63c5901",
"favicon.ico": "55494552f3cc39f73d5f9bfb7d4dd613",
"index.html": "5c47477e03225908399934d063b30502",
"/": "5c47477e03225908399934d063b30502",
"main.dart.js": "71a8f2b446f781df80c06a9b2a0fdd2d",
"manifest.json": "1bf4a68e2182d0f2b5c2b8c3774c5b10",
"ms-icon-144x144.png": "0878541f982b579da49f699977f4a9b9",
"ms-icon-150x150.png": "62737818c59fd7b887c20b0048f6991e",
"ms-icon-310x310.png": "426cda289b718d747a73e7bd010c34a1",
"ms-icon-70x70.png": "23d379d60102020377b32caf8451b374",
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
