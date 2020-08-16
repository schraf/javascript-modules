import { UnitTest } from './test.js'
import { PooledObject, ObjectPool } from '../objectpool.js'

class TestPooledObject extends PooledObject {
  constructor (pool) {
    super(pool)

    this.created = true
    this.initialized = false
    this.cleanedup = false
    this.data = undefined
  }

  init (data) {
    this.initialized = true
    this.data = data
  }

  released () {
    this.cleanedup = true
  }
}

export class TestObjectPool extends UnitTest {
  constructor () {
    super('object_pool')
  }

  test () {
    const pool = new ObjectPool(5, 10, (...args) => new TestPooledObject(...args))

    this.equals(pool.available(), 5, 'pool initial objects not created')
    const o1 = pool.acquire(0xDEADBEEF)
    this.equals(pool.available(), 4, 'pool not used')

    this.assert(o1.created, 'pool object not constructed')
    this.assert(o1.initialized, 'pool object not initialized')
    this.assert(!o1.cleanedup, 'pool object released')
    this.equals(o1.data, 0xDEADBEEF, 'pool object data incorrect')
    this.assert(!o1.freed, 'pool object freed')

    o1.release()
    this.equals(pool.available(), 5, 'pool object not returned')
    this.assert(o1.cleanedup, 'pool object released not called')
    this.assert(o1.freed, 'pool object not freed')

    const objects = []

    for (let i = 0; i < 20; i++) {
      const o = pool.acquire(i)
      objects.push(o)
      this.equals(o.data, i, 'object not initialized')
    }

    this.equals(pool.available(), 0, 'pool not exhausted')
    objects.forEach(o => o.release())
    this.equals(pool.available(), 10, 'pool max not kept')
  }
}
