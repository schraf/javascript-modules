import { UnitTest } from './test.js'
import * as FS from '../fs.js'

export class TestFS extends UnitTest {
  constructor () {
    super('filesystem')
  }

  test () {
    const data = Uint8Array.of(1, 2, 3, 4, 5)

    FS.setdrive('test')
    FS.clear()
    this.assert(FS.list().length === 0, 'file system not cleared')
    FS.write('a.dat', data)
    this.assert(FS.read('a.dat'), 'file a.dat not found')
    FS.rename('a.dat', 'b.dat')
    this.assert(!FS.read('a.dat'), 'file a.dat not renamed')
    this.assert(FS.read('b.dat'), 'file b.dat not found')
    FS.copy('b.dat', 'c.dat')
    this.assert(FS.read('b.dat'), 'file b.dat removed after copy')
    this.assert(FS.read('c.dat'), 'file c.dat not found')
    FS.remove('b.dat')
    this.assert(!FS.read('b.dat'), 'file b.dat not removed')

    const data2 = FS.read('c.dat')
    this.equals(data.length, data2.length, 'file length mismatch')
    this.equals(data[0], data2[0], 'data mismatch')
    this.equals(data[1], data2[1], 'data mismatch')
    this.equals(data[2], data2[2], 'data mismatch')
    this.equals(data[3], data2[3], 'data mismatch')
    this.equals(data[4], data2[4], 'data mismatch')

    FS.flush()

    const files = FS.list()
    this.assert(files.length === 1 && files[0] === 'c.dat', 'file list mismatch')

    FS.clear()
    this.assert(FS.list().length === 0, 'file system not cleared')
  }
}
