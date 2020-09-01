import { UnitTest } from './test.js'
import * as Parser from '../parser.js'

class Token {
  constructor (id, value) {
    this.id = id
    this.value = value
  }

  is (id) {
    return this.id === id
  }
}

function mnemonic (name) {
  return new Token('MNEMONIC', name)
}

function number (value) {
  return new Token('NUMBER', value)
}

function symbol (name) {
  return new Token('SYMBOL', name)
}

export class TestParser extends UnitTest {
  constructor () {
    super('parser')
  }

  test () {
    const result = Parser.grammar()
      .rule('PROGRAM', Parser.zeroOrMore(Parser.nonterminal('INST')))
      .rule('INST', Parser.sequence(Parser.terminal('MNEMONIC'), Parser.optional(Parser.nonterminal('ARG'))))
      .rule('ARG', Parser.choice(Parser.terminal('NUMBER'), Parser.terminal('SYMBOL')))
      .start('PROGRAM')
      .parse([
        mnemonic('LOAD'), symbol('x'),
        mnemonic('ADD'), number(45),
        mnemonic('STORE'), symbol('y'),
        mnemonic('RET')
      ])

    this.equals(result.length, 4, 'failed to parse all instructions')
    this.equals(result[0][0].value, 'LOAD', 'unexpected mnemonic')
    this.equals(result[0][1].value, 'x', 'unexpected argument')
    this.equals(result[1][0].value, 'ADD', 'unexpected mnemonic')
    this.equals(result[1][1].value, 45, 'unexpected argument')
    this.equals(result[2][0].value, 'STORE', 'unexpected mnemonic')
    this.equals(result[2][1].value, 'y', 'unexpected argument')
    this.equals(result[3].length, 1, 'unexpected argument in RET instruction')
    this.equals(result[3][0].value, 'RET', 'unexpected mnemonic')
  }
}
