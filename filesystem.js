/* eslint-env browser */

async function apply(db, access, func) {
    const transaction = db.transaction(['files'], access)

    await new Promise((resolve, reject) => {
      const store = transaction.objectStore('files')

      transaction.oncomplete = event => {
        resolve()
      }

      transaction.onerror = event => {
        reject(event.target.error)
      }

      func(store)
    })
}

export class FileSystem {
  constructor (name, version) {
    this.db = null
    this.name = name
    this.version = version
  }

  async open () {
    await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version)

      request.onerror = event => {
        reject(event.target.errorCode)
      }

      request.onsuccess = event => {
        this.db = event.target.result
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = event.target.result
        db.createObjectStore('files', { keyPath: 'name' })
      }
    })
  }

  async write (name, data) {
    await apply(this.db, 'readwrite', store => {
      const request = store.get(name)

      request.onsuccess = event => {
        if (event.target.result === undefined) {
          store.add({
            name: name,
            data: data,
            size: data.byteLength,
            date: Date.now()
          })
        } else {
          const file = event.target.result
          file.data = data
          file.size = data.byteLength
          file.date = Date.now()
          store.put(file)
        }
      }
    })
  }

  async delete (name) {
    await apply(this.db, 'readwrite', store => {
      store.delete(name)
    })
  }

  async read (name) {
    return await new Promise((resolve, reject) => {
      apply(this.db, 'readonly', store => {
        const request = store.get(name)
        request.onsuccess = event => {
          resolve(event.target.result)
        }
      })
    })
  }
}
