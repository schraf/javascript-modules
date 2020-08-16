
export class PooledObject {
  constructor (pool) {
    this.pool = pool
    this.freed = false
  }

  init () { }
  released () { }

  release () {
    this.pool.release(this)
  }
}

export class ObjectPool {
  constructor (initial, max, func) {
    this.max = max
    this.func = func
    this.free = []
    this.used = 0

    for (let i = 0; i < initial; i++) {
      this.free.push(func(this))
    }
  }

  available () {
    return this.free.length
  }

  acquire (...args) {
    let obj = this.free.pop()

    if (obj === undefined) {
      obj = this.func(this)
    } else {
      obj.freed = false
    }

    obj.init.apply(obj, args)
    this.used++
    return obj
  }

  release (obj) {
    this.used--
    obj.released.apply(obj)
    obj.freed = true

    if (this.free.length < this.max) {
      this.free.push(obj)
    }
  }
}
