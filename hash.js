export class Hash {
  constructor () {
    this.hash = 0
  }

  next (v) {
    this.hash = v + (this.hash << 6) + (this.hash << 16) - this.hash
    return this.hash
  }

  string (s) {
    s.split('').forEach(c => this.next(c.charCodeAt(0)))
  }

  finalize () {
    const hash = this.hash
    this.hash = 0
    return hash
  }

  static fromString (string) {
    Hash.from(string.split('').map(c => c.charCodeAt(0)))
  }

  static from (iterable) {
    const hasher = new Hash()
    iterable.forEach(v => hasher.next(v))
    return hasher.finalize()
  }

  static of (...args) {
    return Hash.from(args)
  }
}
