const OPERATOR_SEQUENCE = 1
const OPERATOR_CHOICE = 2
const OPERATOR_ZERO_OR_MORE = 3
const OPERATOR_ONE_OR_MORE = 4
const OPERATOR_OPTIONAL = 5
const OPERATOR_TERMINAL = 6
const OPERATOR_NONTERMINAL = 7

export class ParseError {
  constructor (token) {
    this.token = token
  }

  toString () {
    return this.token.toString()
  }
}

class Expression {
  constructor (operator, ...data) {
    this.operator = operator
    this.data = data
  }
}

class Rule {
  constructor (expression, func) {
    this.expression = expression
    this.func = func
  }
}

class Grammar {
  constructor () {
    this.rules = new Map()
  }

  start (name) {
    this.start = name
    return this
  }

  rule (name, expression, func) {
    const rule = new Rule(expression, func)
    this.rules.set(name, rule)
    return this
  }

  parse (tokens) {
    const [success, result] = this._applyRule(this.start, tokens)

    if (tokens.length !== 0) {
      throw new ParseError(tokens[0])
    }

    if (!success) {
      throw new Error('syntax error')
    }

    return result
  }

  _applyRule (name, tokens) {
    const rule = this.rules.get(name)

    if (rule === undefined) {
      throw new Error(`no grammar rule for nonterminal '${name}'`)
    }

    const [success, result] = this._exec(rule.expression, tokens)
    const func = rule.func

    if (!success) {
      return [false, undefined]
    }

    if (func) {
      return [true, func(result)]
    }

    return [true, result]
  }

  _exec (expr, tokens) {
    switch (expr.operator) {
      case OPERATOR_SEQUENCE: {
        const results = []

        for (const e of expr.data) {
          const [success, result] = this._exec(e, tokens)

          if (!success) {
            return [false, undefined]
          }

          if (result) {
            results.push(result)
          }
        }

        return [true, results]
      }

      case OPERATOR_CHOICE: {
        const [success, result] = this._exec(expr.data[0], tokens)

        if (success) {
          return [true, result]
        }

        return this._exec(expr.data[1], tokens)
      }

      case OPERATOR_ZERO_OR_MORE: {
        const results = []

        while (true) {
          const [success, result] = this._exec(expr.data[0], tokens)

          if (success) {
            if (result) {
              results.push(result)
            }
          } else {
            return [true, results]
          }
        }
      }

      case OPERATOR_ONE_OR_MORE: {
        const results = []

        while (true) {
          const [success, result] = this._exec(expr.data[0], tokens)
          let count = 0

          if (success) {
            count++

            if (result) {
              results.push(result)
            }
          } else {
            if (count === 0) {
              return [false, undefined]
            }

            return [true, results]
          }
        }
      }

      case OPERATOR_OPTIONAL: {
        const [, result] = this._exec(expr.data[0], tokens)
        return [true, result]
      }

      case OPERATOR_TERMINAL: {
        if (tokens.length === 0) {
          return [false, undefined]
        }

        const token = tokens.shift()

        if (!token.is(expr.data[0])) {
          tokens.unshift(token)
          return [false, undefined]
        }

        return [true, token]
      }

      case OPERATOR_NONTERMINAL:
        return this._applyRule(expr.data[0], tokens)
    }
  }
}

export function grammar () {
  return new Grammar()
}

export function sequence (...e) {
  return new Expression(OPERATOR_SEQUENCE, ...e)
}

export function choice (e1, e2) {
  return new Expression(OPERATOR_CHOICE, e1, e2)
}

export function zeroOrMore (e) {
  return new Expression(OPERATOR_ZERO_OR_MORE, e)
}

export function oneOrMore (e) {
  return new Expression(OPERATOR_ONE_OR_MORE, e)
}

export function optional (e) {
  return new Expression(OPERATOR_OPTIONAL, e)
}

export function terminal (token) {
  return new Expression(OPERATOR_TERMINAL, token)
}

export function nonterminal (name) {
  return new Expression(OPERATOR_NONTERMINAL, name)
}
