import { UnitTest } from './test.js'
import { Hash } from '../hash.js'

export class TestHash extends UnitTest {
  constructor () {
    super('hash')
  }

  generate () {
    const data = []
    const len = Math.max(Math.floor(Math.random() * 100), 5)

    for (let i = 0; i < len; i++) {
      const value = Math.floor(Math.random() * 255)
      data.push(value)
    }

    return data
  }

  test () {
    const hashes = []

    for (let i = 0; i < 1000; i++) {
      const hash = Hash.from(this.generate())
      this.assert(hashes.indexOf(hash) === -1, `duplicate hash value found ${hash}`)
      hashes.push(hash)
    }
  }
}
