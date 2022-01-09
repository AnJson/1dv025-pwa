const version = '1.0.0'

self.addEventListener('install', () => {
  console.info('ServiceWorker: Installed version ', version)
})

self.addEventListener('activate', event => {
  console.info('ServiceWorker is activated, version: ', version)

  /**
   * Delete old versions in cache.
   *
   * @returns {Promise} - A promise to delete all previous cached versions.
   */
  const removeCachedAssets = async () => {
    const cacheKeys = await self.caches.keys()

    return Promise.all(
      cacheKeys.map((cache) => {
        if (cache !== version) {
          console.info('ServiceWorker is deleting cache: ', cache)
          return self.caches.delete(cache)
        }

        return undefined
      })
    )
  }

  event.waitUntil(removeCachedAssets())
})

self.addEventListener('fetch', event => {
  /**
   * When online, cache the objects to be used if offline.
   *
   * @param {object} request - The request-object.
   * @returns {Promise} - Promise that resolves in the response from server or cache.
   */
  const cachedFetch = async request => {
    try {
      const response = await fetch(request)
      const cache = await self.caches.open(version)

      // Cache request only if NOT remote request or POST-request.
      if (request.referrer.includes('localhost:3000') && request.url.includes('localhost:3000')) {
        if (request.method !== 'POST') {
          cache.put(request, response.clone())
        }
      }

      return response
    } catch {
      console.info('ServiceWorker: Serving cached result')
      return self.caches.match(request)
    }
  }
  event.respondWith(cachedFetch(event.request))
})
