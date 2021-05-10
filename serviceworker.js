/* eslint-env serviceworker */

class ServiceWorker {
  static async install (version, assets) {
    const cache = await caches.open(version)
    await cache.addAll(assets)
  }

  static async activate (version) {
    const keys = await caches.keys()
    await keys.map(key => {
      if (key !== version) {
        return caches.delete(key)
      }
    })
    clients.claim()
  }

  static async fetch (event) {
    const result = await caches.match(event.request)
    return result || fetch(event.request)
  }
}

export function init (version, assets) {
  self.addEventListener('install', event => {
    event.waitUntil(ServiceWorker.install(version, assets))
  })

  self.addEventListener('activate', event => {
    event.waitUntil(ServiceWorker.activate(version))
  })

  self.addEventListener('fetch', event => {
    event.respondWith(ServiceWorker.fetch(event))
  })
}

export async function register (url) {
  let registered = false

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register(url)
      registered = true
    } catch (e) {
    }
  }

  return registered
}
