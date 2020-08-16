/* eslint-env browser */

class UnitTestException {
  constructor (description) {
    this.description = description
  }

  toString () {
    return this.description
  }
}

export class UnitTest {
  constructor (name) {
    this.name = name
  }

  equals (a, b, description) {
    if (a !== b) {
      throw new UnitTestException(`${description} (${a} != ${b})`)
    }
  }

  equalsf (a, b, description) {
    if (Math.abs(a - b) > 0.00001) {
      throw new UnitTestException(`${description} (${a} !~ ${b})`)
    }
  }

  notequals (a, b, description) {
    if (a === b) {
      throw new UnitTestException(`${description} (${a} == ${b})`)
    }
  }

  notequalsf (a, b, description) {
    if (Math.abs(a - b) < 0.00001) {
      throw new UnitTestException(`${description} (${a} ~= ${b})`)
    }
  }

  assert (a, description) {
    if (!a) {
      throw new UnitTestException(description)
    }
  }

  run (stdout, stderr) {
    try {
      const starttime = performance.now()
      this.test()
      const endtime = performance.now()
      stdout(`[PASS] ${this.name} (${Math.floor((endtime - starttime) * 100) / 100} ms)`)
    } catch (e) {
      stderr(`[FAIL] ${this.name} : ${e.toString()}`)
    }
  }
}
