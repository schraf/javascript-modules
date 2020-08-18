import { UnitTest } from './test.js'
import * as Float from '../float.js'

export class TestFloatSanity extends UnitTest {
  constructor () {
    super('float_sanity')
  }

  test () {
    this.assert(Float.sanityCheck(0.0), 'sanity check failed for 0.0')
    this.assert(!Float.sanityCheck(NaN), 'sanity check failed for NaN')
    this.assert(!Float.sanityCheck(Infinity), 'sanity check failed for Infinity')
    this.assert(!Float.sanityCheck(-Infinity), 'sanity check failed for -Infinity')
  }
}

export class TestFloatZero extends UnitTest {
  constructor () {
    super('float_zero')
  }

  test () {
    this.assert(Float.isZero(0.0), 'zero check failed for 0.0')
    this.assert(!Float.isZero(1.0), 'zero check failed for 1.0')
    this.assert(!Float.isZero(0.0001), 'zero check failed for 0.0001')
    this.assert(Float.isZero(1e-10), 'zero check failed for 1e-10')
    this.assert(!Float.isZero(NaN), 'zero check failed for NaN')
    this.assert(!Float.isZero(Infinity), 'zero check failed for Infinity')
    this.assert(!Float.isZero(-Infinity), 'zero check failed for -Infinity')
  }
}

export class TestFloatEqual extends UnitTest {
  constructor () {
    super('float_equal')
  }

  test () {
    this.assert(Float.isEqual(0.0, 0.0), 'equal check failed for 0.0 and 0.0')
    this.assert(!Float.isEqual(0.0, 1.0), 'equal check failed for 0.0 and 1.0')
    this.assert(!Float.isEqual(0.0, 0.0001), 'equal check failed for 0.0 and 0.0001')
    this.assert(Float.isEqual(0.0, 1e-10), 'equal check failed for 0.0 and 1e-10')
    this.assert(!Float.isEqual(0.0, NaN), 'equal check failed for 0.0 and NaN')
    this.assert(!Float.isEqual(0.0, Infinity), 'equal check failed for 0.0 and Infinity')
    this.assert(!Float.isEqual(0.0, -Infinity), 'equal check failed for 0.0 and -Infinity')
  }
}
