import { UnitTest } from './test.js'
import * as Tokenizer from '../tokenizer.js'

const TOKEN_NUMBER = 1
const TOKEN_ADD = 2
const TOKEN_SUB = 3

export class TestTokenizer extends UnitTest {
  constructor () {
    super('tokenizer')
  }

  test () {
    const tokens = Tokenizer.create()
      .token('\\s+')
      .token('([1-9]+[0-9]*|0)', () => TOKEN_NUMBER)
      .token('\\+', () => TOKEN_ADD)
      .token('-', () => TOKEN_SUB)
      .run('1 + 1234-10')

    this.equals(tokens.length, 5)
    this.equals(tokens[0], TOKEN_NUMBER, 'expected number token')
    this.equals(tokens[1], TOKEN_ADD, 'expected addition token')
    this.equals(tokens[2], TOKEN_NUMBER, 'expected number token')
    this.equals(tokens[3], TOKEN_SUB, 'expected subtraction token')
    this.equals(tokens[4], TOKEN_NUMBER, 'expected number token')
  }
}
