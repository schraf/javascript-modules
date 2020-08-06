export class Application {
  constructor () {
    this.term = null
    this.pid = -1
  }

  clear () {
    this.term.clear()
  }

  print (text) {
    this.term.print(text)
  }

  exit () {
    this.term.exit()
  }

  onStart (term, pid) {
    this.term = term
    this.pid = pid
  }

  onInput (input) {
    const tokens = input.split(/\s/)

    if (tokens[0] !== '') {
      const command = tokens.shift()
      this.onCommand(command, ...tokens)
    }
  }

  onCommand (command, ...args) {
    this.term.print(command + ': command not found')
  }
}

class Terminal {
  constructor (parent) {
    this.container = document.createElement('div')
    this.container.classList.add('term-container')
    this.cursor = document.createElement('span')
    this.cursor.classList.add('term-line-cursor')
    this.stack = []
    this.line = null
    this.nextPid = 1

    parent.appendChild(this.container)
  }

  app () {
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1]
    }

    return null
  }

  clear () {
    while (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild)
    }
  }

  exec (app) {
    this.stack.push(app)
    app.onStart(this, this.nextPid++)
    this.startPrompt(app)
  }

  input (ch) {
    if (this.stack.length === 0) {
      return
    }

    if (ch === 'Tab' || ch === ' ') {
      this.line.innerHTML += '&nbsp'
    } else if (ch.length === 1) {
      this.line.innerText += ch
    } else if (ch === 'Backspace') {
      if (this.line.innerText.length > 0) {
        this.line.innerText = this.line.innerText.substring(0, this.line.innerText.length - 1)
      }
    } else if (ch === 'Enter') {
      const text = this.line.innerText
      let app = this.app()
      const pid = app.pid
      app.onInput(text)
      app = this.app()

      if (app !== null && app.pid === pid) {
        this.startPrompt(app)
      }
    }
  }

  exit () {
    this.stack.pop()

    const app = this.app()

    if (app !== null) {
      this.startPrompt(app)
    }
  }

  print (text) {
    this.startLine()
    this.line.innerText = text
  }

  startLine () {
    if (this.cursor.parentElement !== null) {
      this.cursor.parentElement.removeChild(this.cursor)
    }

    const container = document.createElement('div')
    container.classList.add('term-line')

    this.line = document.createElement('span')
    this.line.classList.add('term-line-content')

    container.appendChild(this.line)
    container.appendChild(this.cursor)
    this.container.appendChild(container)

    return container
  }

  startPrompt (app) {
    const line = this.startLine()

    if (app.prompt) {
      const prompt = document.createElement('span')
      prompt.classList.add('term-line-prompt')
      prompt.innerText = app.prompt
      line.prepend(prompt)
    }
  }
}

export function create (container, app) {
  const term = new Terminal(container)
  term.exec(app)
  return term
}
