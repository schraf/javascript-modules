export const TYPE_I32 = 0x7F
export const TYPE_F32 = 0x7D
export const TYPE_NIL = 0

function int (value) {
  const bytes = []

  value |= 0

  while (true) {
    const byte = value & 0x7F
    value >>= 7

    if ((value === 0 && (byte & 0x40) === 0) || (value === -1 && (byte & 0x40) !== 0)) {
      bytes.push(byte)
      return bytes
    }

    bytes.push(byte | 0x80)
  }
}

function uint (value) {
  const bytes = []

  value |= 0

  while (true) {
    let byte = value & 0x7F
    value >>= 7

    if (value !== 0) {
      byte |= 0x80
    }

    bytes.push(byte)

    if (value === 0) {
      return bytes
    }
  }
}

function f32 (value) {
  return Array.from(new Uint8Array(Float32Array.of(value).buffer).values())
}

function vec (bytes, count) {
  return [...uint(count || bytes.length), ...bytes]
}

function encodeName (text) {
  return vec([...text].map((_, i) => text.charCodeAt(i)))
}

function constant (type, value) {
  switch (type) {
    case TYPE_I32: return [0x41, ...int(value)]
    case TYPE_F32: return [0x43, ...f32(value)]
  }
}

function section (id, elements) {
  const count = elements.length
  const bytes = elements.reduce((acc, curr) => acc.concat(curr), [])
  const data = vec(bytes, count)
  return [id, ...uint(data.length), ...data]
}

class Code {
  constructor () {
    this.inst = []
  }

  loop (code) { this.inst.push(0x03, 0x40, ...code.inst, 0x0B); return this }
  if (code) { this.inst.push(0x04, 0x40, ...code.inst, 0x0B); return this }
  ifelse (code1, code2) { this.inst.push(0x04, 0x40, ...code1.inst, 0x05, ...code2.inst, 0x0B); return this }
  branch (index) { this.inst.push(0x0C, ...uint(index)); return this }
  branchif (index) { this.inst.push(0x0D, ...uint(index)); return this }
  brk () { this.inst.push(0x00); return this }
  nop () { this.inst.push(0x01); return this }
  ret () { this.inst.push(0x0F); return this }
  drop () { this.inst.push(0x1A); return this }
  call (index) { this.inst.push(0x10, ...index); return this }
  getlocal (index) { this.inst.push(0x20, ...uint(index)); return this }
  setlocal (index) { this.inst.push(0x21, ...uint(index)); return this }
  getglobal (index) { this.inst.push(0x23, ...index); return this }
  setglobal (index) { this.inst.push(0x24, ...index); return this }
  load8u (offset, align) { this.inst.push(0x2D, ...int(align || 1), ...int(offset)); return this }
  load8s (offset, align) { this.inst.push(0x2C, ...int(align || 1), ...int(offset)); return this }
  load16u (offset, align) { this.inst.push(0x2F, ...int(align || 1), ...int(offset)); return this }
  load16s (offset, align) { this.inst.push(0x2E, ...int(align || 1), ...int(offset)); return this }
  load32 (offset, align) { this.inst.push(0x28, ...int(align || 1), ...int(offset)); return this }
  loadf (offset, align) { this.inst.push(0x2A, ...int(align || 1), ...int(offset)); return this }
  store8 (offset, align) { this.inst.push(0x3A, ...int(align || 1), ...int(offset)); return this }
  store16 (offset, align) { this.inst.push(0x3B, ...int(align || 1), ...int(offset)); return this }
  store32 (offset, align) { this.inst.push(0x36, ...int(align || 1), ...int(offset)); return this }
  storef (offset, align) { this.inst.push(0x38, ...int(align || 1), ...int(offset)); return this }
  memgrow () { this.inst.push(0x40, 0x00); return this }
  memsize () { this.inst.push(0x3F, 0x00); return this }
  const32 (value) { this.inst.push(0x41, ...int(value)); return this }
  constf (value) { this.inst.push(0x43, ...f32(value)); return this }
  eqz () { this.inst.push(0x45); return this }
  eq () { this.inst.push(0x46); return this }
  ne () { this.inst.push(0x47); return this }
  lts () { this.inst.push(0x48); return this }
  ltu () { this.inst.push(0x49); return this }
  gts () { this.inst.push(0x4A); return this }
  gtu () { this.inst.push(0x4B); return this }
  les () { this.inst.push(0x4C); return this }
  leu () { this.inst.push(0x4D); return this }
  ges () { this.inst.push(0x4E); return this }
  geu () { this.inst.push(0x4F); return this }
  eqf () { this.inst.push(0x5B); return this }
  nef () { this.inst.push(0x5C); return this }
  ltf () { this.inst.push(0x5D); return this }
  gtf () { this.inst.push(0x5E); return this }
  lef () { this.inst.push(0x5F); return this }
  gef () { this.inst.push(0x60); return this }
  add () { this.inst.push(0x6A); return this }
  sub () { this.inst.push(0x6B); return this }
  mul () { this.inst.push(0x6C); return this }
  divs () { this.inst.push(0x6D); return this }
  divu () { this.inst.push(0x6E); return this }
  rems () { this.inst.push(0x6F); return this }
  remu () { this.inst.push(0x70); return this }
  and () { this.inst.push(0x71); return this }
  or () { this.inst.push(0x72); return this }
  xor () { this.inst.push(0x73); return this }
  shl () { this.inst.push(0x74); return this }
  shr () { this.inst.push(0x76); return this }
  rotl () { this.inst.push(0x77); return this }
  rotr () { this.inst.push(0x78); return this }
  absf () { this.inst.push(0x8B); return this }
  negf () { this.inst.push(0x8C); return this }
  ceilf () { this.inst.push(0x8D); return this }
  floorf () { this.inst.push(0x8E); return this }
  truncf () { this.inst.push(0x8F); return this }
  nearestf () { this.inst.push(0x90); return this }
  sqrtf () { this.inst.push(0x91); return this }
  addf () { this.inst.push(0x92); return this }
  subf () { this.inst.push(0x93); return this }
  mulf () { this.inst.push(0x94); return this }
  divf () { this.inst.push(0x95); return this }
  minf () { this.inst.push(0x96); return this }
  maxf () { this.inst.push(0x97); return this }
  truncs () { this.inst.push(0xA8); return this }
  truncu () { this.inst.push(0xA9); return this }
  convert () { this.inst.push(0xB2); return this }
}

export class Module {
  constructor () {
    this.functypes = []
    this.imports = []
    this.funcs = []
    this.mem = []
    this.globals = []
    this.exports = []
    this.codes = []
    this.datas = []
    this.funcidx = 0
    this.memidx = 0
    this.globalidx = 0
  }

  importfunc (mod, name, ret, ...params) {
    if (this.funcs.length > 0) {
      throw new Error('all import functions must be added before module functions')
    }

    const i = [...encodeName(mod), ...encodeName(name), 0x00, ...this._functype(ret, params)]
    this.imports.push(i)

    return uint(this.funcidx++)
  }

  importmem (mod, name, minpages, maxpages) {
    if (this.mem.length > 0) {
      throw new Error('all import memory instances must be added before module memory instances')
    }

    const i = [...encodeName(mod), ...encodeName(name), 0x02, 0x01, ...uint(minpages), ...uint(maxpages)]
    this.imports.push(i)

    return uint(this.memidx++)
  }

  importglobal (mod, name, type, mutable) {
    if (this.globals.length > 0) {
      throw new Error('all import globals must be added before module globals')
    }

    const i = [...encodeName(mod), ...encodeName(name), 0x03, type, mutable ? 0x01 : 0x00]
    this.imports.push(i)

    return uint(this.globalidx++)
  }

  code () {
    return new Code()
  }

  func (locals, code, ret, ...params) {
    const f = this._functype(ret, params)
    const l = locals.reduce((acc, type) => acc.concat([...uint(1), type]), [])
    const c = [...vec(l, locals.length), ...code.inst, 0x0B]
    this.codes.push([uint(c.length), ...c])
    this.funcs.push(f)
    return uint(this.funcidx++)
  }

  memory (minpages, maxpages) {
    const m = [0x01, ...uint(minpages), ...uint(maxpages)]
    this.mem.push(m)
    return uint(this.memidx++)
  }

  global (type, initial, mutable) {
    const g = [type, mutable ? 0x01 : 0x00, ...constant(type, initial), 0x0B]
    this.globals.push(g)
    return uint(this.globalidx++)
  }

  exportfunc (name, index) {
    const e = [...encodeName(name), 0x00, ...index]
    this.exports.push(e)
  }

  exportmem (name, index) {
    const e = [...encodeName(name), 0x02, ...index]
    this.exports.push(e)
  }

  exportglobal (name, index) {
    const e = [...encodeName(name), 0x03, ...index]
    this.exports.push(e)
  }

  data (index, offset, data) {
    const d = [...index, ...constant(TYPE_I32, offset), 0x0B, ...vec(data)]
    this.datas.push(d)
  }

  compile () {
    const bytes = []

    bytes.push(0x00, 0x61, 0x73, 0x6D) // magic
    bytes.push(0x01, 0x00, 0x00, 0x00) // version

    if (this.functypes.length > 0) {
      bytes.push(...section(1, this.functypes))
    }

    if (this.imports.length > 0) {
      bytes.push(...section(2, this.imports))
    }

    if (this.funcs.length > 0) {
      bytes.push(...section(3, this.funcs))
    }

    if (this.mem.length > 0) {
      bytes.push(...section(5, this.mem))
    }

    if (this.globals.length > 0) {
      bytes.push(...section(6, this.globals))
    }

    if (this.exports.length > 0) {
      bytes.push(...section(7, this.exports))
    }

    if (this.codes.length > 0) {
      bytes.push(...section(10, this.codes))
    }

    if (this.datas.length > 0) {
      bytes.push(...section(11, this.datas))
    }

    return Uint8Array.from(bytes).buffer
  }

  _functype (ret, params) {
    const t = [0x60, ...vec(params), ...vec(ret === TYPE_NIL ? [] : [ret])]
    let index = this.functypes.findIndex(x => x.every((y, i) => y === t[i]))

    if (index === -1) {
      index = this.functypes.push(t) - 1
    }

    return uint(index)
  }
}
