export const RANDMAX = 0xFFFF

export class RandomGenerator {
  constructor (seed) {
    this.state = seed || 0xABCD
  }

  next () {
    this.state ^= (this.state >> 7) & 0xFFFF
    this.state ^= (this.state << 9) & 0xFFFF
    this.state ^= (this.state >> 13) & 0xFFFF
    return this.state
  }

  next01 () {
    return this.next() / RANDMAX
  }

  next32 () {
    return Math.abs((this.next01() * 0xFFFFFFFF) | 0)
  }
}

export const GlobalRandomGenerator = new RandomGenerator(Date.now())
