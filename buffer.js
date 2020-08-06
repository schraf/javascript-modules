export class Buffer {
  constructor (size, buffer) {
    this.buffer = buffer || new ArrayBuffer(size)
    this.view = new DataView(this.buffer, 0, size)
    this.pos = 0
  }

  isValid () {
    return this.pos >= 0 &&
      this.pos < this.view.byteLength
  }

  isEOF () {
    return this.isValid() && this.pos === this.view.byteLength
  }

  reset () {
    this.pos = 0
  }

  readU8 () {
    return this.view.getUint8(this.pos++)
  }

  readI8 () {
    return this.view.getInt8(this.pos++)
  }

  readU16 () {
    const value = this.view.getUint16(this.pos)
    this.pos += 2
    return value
  }

  readI16 () {
    const value = this.view.getInt16(this.pos)
    this.pos += 2
    return value
  }

  readU32 () {
    const value = this.view.getUint32(this.pos)
    this.pos += 4
    return value
  }

  readI32 () {
    const value = this.view.getInt32(this.pos)
    this.pos += 4
    return value
  }

  readF32 () {
    const value = this.view.getFloat32(this.pos)
    this.pos += 4
    return value
  }

  writeU8 (value) {
    this.view.setUint8(this.pos++, value)
  }

  writeI8 (value) {
    this.view.setInt8(this.pos++, value)
  }

  writeU16 (value) {
    this.view.setUint16(this.pos, value)
    this.pos += 2
  }

  writeI16 (value) {
    this.view.setInt16(this.pos, value)
    this.pos += 2
  }

  writeU32 (value) {
    this.view.setUint32(this.pos, value)
    this.pos += 4
  }

  writeI32 (value) {
    this.view.setInt32(this.pos, value)
    this.pos += 4
  }

  writeF32 (value) {
    this.view.setFloat32(this.pos, value)
    this.pos += 4
  }

  writeBuffer (buffer, bytes) {
    for (let i = 0; i < bytes; i++) {
      this.writeU8(buffer.readU8())
    }
  }
}
