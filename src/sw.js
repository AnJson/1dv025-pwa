const version = '1.0.0'

// -------------------------------------------------
// SW Helper-functions.
// -------------------------------------------------

/**
 * Attempt to send message to client.
 *
 * @param {number} id - The client-id from the event-object.
 * @param {boolean} status - The status of connection.
 * @returns {Promise} - A promise to post message to client, resolves to undefiend if client not available.
 */
const sendConnectionStatusToClient = async (id, status) => {
  // Exit early if we don't have access to the client.
  // Eg, if it's cross-origin.
  if (!id) {
    return
  }

  // Get the client.
  const client = await self.clients.get(id)
  // Exit early if we don't get the client.
  // Eg, if it closed.
  if (!client) {
    return
  }

  // Send a message to the client.
  client.postMessage({
    online: status
  })
}

// -------------------------------------------------
// Public interface.
// -------------------------------------------------

self.addEventListener('install', event => {
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
   * @param {string} id - The client-id of the request-event.
   * @param {Function} sendMessage - A send-message function, taking id(string) and status(boolean).
   * @returns {Promise} - Promise that resolves in the response from server or cache.
   */
  const cachedFetch = async (request, id, sendMessage) => {
    try {
      const response = await fetch(request)
      const cache = await self.caches.open(version)

      // Cache request only if NOT remote request or POST-request.
      if (!request.referrer || (request.referrer.includes('localhost:3000') && request.url.includes('localhost:3000'))) {
        if (request.method !== 'POST') {
          cache.put(request, response.clone())
        }
      }
      sendMessage(id, true)
      return response
    } catch {
      console.info('ServiceWorker: Serving cached result')

      sendMessage(id, false)
      return self.caches.match(request)
    }
  }
  event.respondWith(cachedFetch(event.request, event.clientId, sendConnectionStatusToClient))
})
