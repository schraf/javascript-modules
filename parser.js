
const OPERATOR_SEQUENCE = 1
const OPERATOR_CHOICE = 2
const OPERATOR_ZERO_OR_MORE = 3
const OPERATOR_ONE_OR_MORE = 4
const OPERATOR_OPTIONAL = 5

class Expression {
  static sequence (...expressions) {
    return new Expression(OPERATOR_SEQUENCE, ...expressions)
  }

  static choice (e1, e2) {
    return new Expression(OPERATOR_CHOICE, e1, e2)
  }

  static zeroOrMore (e) {
    return new Expression(OPERATOR_ZERO_OR_MORE, e)
  }

  static oneOrMore (e) {
    return new Expression(OPERATOR_ONE_OR_MORE, e)
  }

  static optional (e) {
    return new Expression(OPERATOR_OPTIONAL, e)
  }

  constructor (operator, ...expressions) {
    this.operator = operator
    this.expressions = expressions
  }
}

class ParseRule {
  constructor () {
    this.rules = []
  }

  seq (...rules) {
    this.rules.concat(rules)
  }

  or (a, b) {
  }

  oneOrMore (rule) {
  }

  zeroOrMore (rule) {
  }

  optional (rule) {
  }

  apply (tokens) {
    const
  }
}

rule('program')
  .seq('IF', '(', rule('condition'))
