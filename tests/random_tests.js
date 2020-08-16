import { UnitTest } from './test.js'
import { RandomGenerator, RANDMAX } from '../random.js'

export class TestRandomMax extends UnitTest {
  constructor () {
    super('random_max')
  }

  test () {
    const gen = new RandomGenerator()

    for (let i = 0; i < 1000; ++i) {
      const n = gen.next()
      this.assert(n >= 0 && n <= RANDMAX, `random number bounds failure : 0 <= ${n} <= ${RANDMAX}`)
    }
  }
}

export class TestRandomUnit extends UnitTest {
  constructor () {
    super('random_unit')
  }

  test () {
    const gen = new RandomGenerator()

    for (let i = 0; i < 1000; ++i) {
      const n = gen.next01()
      this.assert(n >= 0.0 && n <= 1.0, `random number bounds failure : 0 <= ${n} <= 1.0`)
    }
  }
}

export class TestRandomU32 extends UnitTest {
  constructor () {
    super('random_u32')
  }

  test () {
    const gen = new RandomGenerator()

    for (let i = 0; i < 1000; ++i) {
      const n = gen.next32()
      this.assert(n >= 0 && n <= 0xFFFFFFFF, `random number bounds failure : 0 <= ${n} <= ${0xFFFFFFFF}`)
    }
  }
}

export class TestRandomUnique extends UnitTest {
  constructor () {
    super('random_unique')
  }

  test () {
    const gen = new RandomGenerator()
    const numbers = []

    for (let i = 0; i < 1000; ++i) {
      const n = gen.next()
      this.assert(!numbers.includes(n), 'random number uniqueness failure')
      numbers.push(n)
    }
  }
}
