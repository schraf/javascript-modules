import { UnitTest } from './test.js'
import { Buffer } from '../buffer.js'

export class TestBuffer extends UnitTest {
  constructor () {
    super('buffer')
  }

  test () {
    const buffer = new Buffer(1024)
    this.assert(buffer.isValid(), 'invalid buffer when set')

    buffer.writeU8(45) // 1 byte
    buffer.writeI16(-12345) // 2 bytes
    buffer.writeU32(0xFFFFFFFF) // 4 bytes
    buffer.writeF32(-45.234) // 4 bytes

    this.assert(buffer.isValid(), 'write failures')
    this.equals(buffer.pos, 11, 'invalid write size')

    buffer.reset()

    this.equals(buffer.readU8(), 45, 'read U8 mismatch')
    this.equals(buffer.readI16(), -12345, 'read I16 mismatch')
    this.equals(buffer.readU32(), 0xFFFFFFFF, 'read U32 mismatch')
    this.equalsf(buffer.readF32(), -45.234, 'read F32 mismatch')
  }
}
