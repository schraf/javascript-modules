/* eslint-env browser */

import { UnitTest } from './test.js'
import * as WASM from '../wasm.js'

export class TestWASM extends UnitTest {
  constructor () {
    super('wasm')
  }

  async test () {
    const mod = new WASM.Module()

    const stdout = mod.importfunc('system', 'stdout', WASM.TYPE_NIL, WASM.TYPE_I32, WASM.TYPE_I32)

    const memidx = mod.memory(1, 1)
    mod.exportmem('memory', memidx)
    mod.data(memidx, 0, 'Hello, World!'.split('').map(c => c.charCodeAt(0)))

    const code = mod.code()
    code.const32(0)
    code.const32(13)
    code.call(stdout)
    code.ret()

    mod.exportfunc('main', mod.func([], code, WASM.TYPE_NIL))

    const data = mod.compile()

    this.assert(WebAssembly.validate(data), 'webassembly module failed validation')

    const compiledModule = await WebAssembly.compile(data)
    let str = ''

    const imports = {
      system: {
        stdout: (ptr, size) => {
          const mem = new Uint8Array(module.exports.memory.buffer)

          this.assert(str === '', 'multiple stdout calls')
          this.assert(ptr < mem.byteLength, 'pointer failed bounds check')
          this.assert(ptr + size < mem.byteLength, 'size failed bounds check')

          for (let i = ptr; i < ptr + size; i++) {
            str += String.fromCharCode(mem[i])
          }
        }
      }
    }

    const module = await WebAssembly.instantiate(compiledModule, imports)

    module.exports.main()
    this.equals(str, 'Hello, World!', 'expected string mismatch')
  }
}
