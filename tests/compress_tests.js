import { UnitTest } from './test.js'
import { compress, decompress } from '../compress.js'

function generate (size, percent) {
  const count = Math.max(1, size * percent) | 0
  const data = new Array(size)
  data.fill(0)

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * size)
    const value = Math.floor(Math.random() * 255)
    data[index] = value
  }

  return data
}

export class TestCompressValidate extends UnitTest {
  constructor () {
    super('compress_validate')
  }

  test () {
    const data = generate(2048, 0.1)
    const compressed = new Uint8Array(compress(data))
    const decompressed = new Uint8Array(decompress(compressed))

    for (let i = 0; i < data.length; i++) {
      this.equals(data[i], decompressed[i], 'compression mismatched value')
    }
  }
}

export class TestCompressSize extends UnitTest {
  constructor () {
    super('compress_size')
  }

  test () {
    const sizes = [512, 1024, 2048, 4096]
    const percents = [0.1, 0.2, 0.3, 0.4]

    for (const size of sizes) {
      for (const percent of percents) {
        const data = generate(size, percent)
        const compressed = compress(data)
        this.assert(compressed.byteLength < size, `compressed size (${compressed.byteLength}) larger than source (${size}) with percent ${percent * 100}%`)
      }
    }
  }
}
