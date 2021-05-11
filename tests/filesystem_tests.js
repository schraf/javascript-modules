import { UnitTest } from './test.js'
import { FileSystem } from '../filesystem.js'

export class TestFS extends UnitTest {
  constructor () {
    super('filesystem')
  }

  async test () {
    const data = new ArrayBuffer(1024)
    const fs = new FileSystem('test-fs', 1)
    await fs.open()
    await fs.write('test.bin', data);
    const file = await fs.read('test.bin')
    this.assert(file !== undefined && file.size === 1024, 'failed to store file')
    await fs.delete('test.bin')
    const removed = await fs.read('test.bin')
    this.assert(removed === undefined, 'file not deleted')
  }
}
