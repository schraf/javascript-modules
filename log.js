export class Log {
  constructor () {
    this.container = document.createElement('div')
    this.container.classList.add('log-container')
  }

  attach (element) {
    element.appendChild(this.container)
  }

  remove (element) {
    element.removeChild(this.container)
  }

  clear () {
    while (this.container.lastChild) {
      this.container.remove(this.container.lastChild)
    }
  }

  debug (...args) {
    this._log('DEBUG', args.join(' '))
  }

  info (...args) {
    this._log('INFO', args.join(' '))
  }

  warn (...args) {
    this._log('WARN', args.join(' '))
  }

  error (...args) {
    this._log('ERROR', args.join(' '))
  }

  _log (level, message) {
    const now = new Date().toUTCString()

    const lineDiv = document.createElement('div')
    const dateSpan = document.createElement('span')
    const levelSpan = document.createElement('span')
    const messageSpan = document.createElement('span')

    lineDiv.classList.add('log-line')
    lineDiv.style.display = 'flex'
    lineDiv.style.flexDirection = 'row'
    lineDiv.style.width = '80ch'

    dateSpan.classList.add('log-line-date')
    dateSpan.style.flex = '30'
    dateSpan.innerText = now

    levelSpan.classList.add('log-line-level')
    levelSpan.classList.add(level.toLowerCase())
    levelSpan.style.flex = '7'
    levelSpan.innerText = `${level}`

    messageSpan.classList.add('log-line-message')
    messageSpan.style.flex = '43'
    messageSpan.innerText = message

    lineDiv.appendChild(dateSpan)
    lineDiv.appendChild(levelSpan)
    lineDiv.appendChild(messageSpan)
    this.container.appendChild(lineDiv)
  }
}
