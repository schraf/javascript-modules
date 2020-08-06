/* eslint-env browser */

const validator = /^[A-Za-z0-9_.]+$/
const storagekey = /^fs\.([A-Za-z0-9_.]+)$/
const cache = new Map()
const dirty = new Set()
let flushtimer = -1

class Storage {
  static store (name, buffer) {
    const array = new Uint8Array(buffer)
    localStorage.setItem(`fs.${name}`, btoa(String.fromCharCode(...array)))
  }

  static fetch (name) {
    const data = localStorage.getItem(`fs.${name}`)

    if (data !== null) {
      return Uint8Array.from(atob(data), ch => ch.charCodeAt(0))
    }

    return null
  }

  static remove (name) {
    localStorage.removeItem(`fs.${name}`)
  }

  static list () {
    const files = []

    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i)
      const match = key.match(storagekey)

      if (match !== null) {
        files.push(match[1])
      }
    }

    return files
  }

  static clear () {
    const files = []

    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i)

      if (storagekey.test(key)) {
        files.push(key)
      }
    }

    files.forEach(key => { localStorage.removeItem(key) })
  }
}

export function list () {
  const files = Storage.list()

  for (const name of cache.keys()) {
    if (files.find(file => file === name) === undefined) {
      files.push(name)
    }
  }

  return files
}

export function read (name) {
  let buffer = cache.get(name)

  if (buffer === undefined) {
    buffer = Storage.fetch(name)

    if (buffer != null) {
      cache.set(name, buffer)
    }
  }

  return buffer
}

export function write (name, buffer) {
  if (!validator.test(name)) {
    throw new Error(`invalid filename ${name}`)
  }

  cache.set(name, buffer)
  dirty.add(name)

  if (flushtimer >= 0) {
    clearTimeout(flushtimer)
  }

  flushtimer = setTimeout(flush, 5000)
}

export function rename (from, to) {
  const buffer = read(from)

  if (buffer !== null) {
    write(to, buffer)
    remove(from)
  }
}

export function copy (from, to) {
  const buffer = read(from)

  if (buffer !== null) {
    write(to, buffer.slice(0))
  }
}

export function remove (name) {
  cache.delete(name)
  dirty.delete(name)
  Storage.remove(name)
}

export function clear () {
  cache.clear()
  dirty.clear()
  Storage.clear()
  clearTimeout(flushtimer)
  flushtimer = -1
}

export function flush () {
  dirty.forEach(name => {
    const buffer = cache.get(name)

    if (buffer !== undefined) {
      Storage.store(name, buffer)
    }
  })

  dirty.clear()
  clearTimeout(flushtimer)
  flushtimer = -1
}
