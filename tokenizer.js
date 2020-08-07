class Tokenizer {
  constructor () {
    this.tokens = []
  }
  
  token (pattern, func) {
    this.tokens.push([new RegExp('^' + pattern), func])
    return this
  }
  
  run (text) {
    const result = []
    const lines = text.split('\n')
    let linenu = 1
  
    while (lines.length > 0) {
      let line = lines.shift()
      
      while (line.length > 0) {
        let found = false
  
        for (const [re, func] of this.tokens) {
          const match = line.match(re)
          
          if (match !== null) {
            const token = func(match, linenu)
            
            if (token) {
              result.push(token)
            }
     
            const length = match[0].length
            line = line.substring(length)
            found = true
            break
          }
        }
        
        if (!found) {
          throw new Error(`syntax error on line ${linenu} near '${line.substring(0, 8)}'`)
        }
      }

      linenu++
    }

    return result
  }
}

export function create () {
  return new Tokenizer()
}
