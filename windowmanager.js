class StatusBar {
  constructor () {
    this.root = document.createElement('div')
    this.root.classList.add('status-bar')
    this.root.style.height = '1.5em'
    this.root.style.display = 'flex'
    this.root.style.justifyContent = 'space-between'
    this.root.style.alignContent = 'center'

    this.title = document.createElement('span')
    this.title.classList.add('title')
    this.title.style.padding = '0 1ch'

    this.date = document.createElement('span')
    this.date.classList.add('date')
    this.date.style.padding = '0 1ch'

    this.root.appendChild(this.title)
    this.root.appendChild(this.date)

    this.setDate(new Date())
    window.setInterval(() => this.setDate(new Date()), 1000)
  }

  setTitle (text) {
    this.title.innerText = text
  }

  setDate (date) {
    this.date.innerText = date.toLocaleString()
  }
}

export class WindowManager {
  constructor (id, title) {
    this.focused = null

    this.root = document.createElement('div')
    this.root.classList.add('window-manager')
    this.root.style.width = '100%'
    this.root.style.height = '100%'
    this.root.style.display = 'flex'
    this.root.style.flexDirection = 'column'

    this.workspace = document.createElement('div')
    this.workspace.classList.add('workspace')
    this.workspace.style.flex = '1'
    this.workspace.style.display = 'flex'
    this.workspace.style.alignItems = 'stretch'
    this.workspace.style.height = 'calc(100% - 1.5em)'

    this.main = document.createElement('div')
    this.main.classList.add('main')
    this.main.style.flex = '3'
    this.main.style.display = 'flex'
    this.main.style.flexDirection = 'column'

    this.rest = document.createElement('div')
    this.rest.classList.add('rest')
    this.rest.style.flex = '2'
    this.rest.style.display = 'flex'
    this.rest.style.flexDirection = 'column'

    this.status = new StatusBar()
    this.status.setTitle(title)

    this.root.appendChild(this.status.root)
    this.root.appendChild(this.workspace)
    document.getElementById(id).appendChild(this.root)
  }

  setTitle (title) {
    this.status.setTitle(title)
  }

  add (name) {
    const win = document.createElement('div')
    win.classList.add('window')
    win.style.flex = '1'
    win.style.position = 'relative'
    win.style.width = '100%'
    win.style.overflow = 'hidden'

    const title = document.createElement('span')
    title.classList.add('title')
    title.style.position = 'absolute'
    title.style.right = '0'
    title.style.padding = '0 1ch'

    title.innerText = name
    win.appendChild(title)

    const content = document.createElement('div')
    win.appendChild(content)

    win.addEventListener('mouseenter', () => { this.focused = content })

    this.setMain(content)
    return content
  }

  remove (content) {
    const win = content.parentElement

    if (win === null) {
      return
    }

    if (this.focused === content) {
      this.focused = null
    }

    if (win.parentElement === this.rest) {
      this.rest.removeChild(win)

      if (this.rest.firstChild === null) {
        this.workspace.removeChild(this.rest)
      } else {
        this._refreshWindows()
      }
    } else if (win.parentElement === this.main) {
      this.main.removeChild(win)

      if (this.rest.lastChild !== null) {
        this.setMain(this.rest.lastChild.lastChild)
      }
    }
  }

  setMain (content) {
    const win = content.parentElement

    if (win === null) {
      return
    }

    if (win.parentElement === this.rest) {
      this.rest.removeChild(win)
    }

    if (this.main.firstChild !== null) {
      const mainWindow = this.main.firstChild
      this.main.removeChild(mainWindow)
      this.rest.appendChild(mainWindow)
    }

    this.main.appendChild(win)

    if (this.main.parentElement === null) {
      this.workspace.appendChild(this.main)
    }

    if (this.rest.parentElement === null && this.rest.firstChild !== null) {
      this.workspace.appendChild(this.rest)
    } else if (this.rest.parentElement !== null && this.rest.firstChild === null) {
      this.workspace.removeChild(this.rest)
    }

    this._refreshWindows()
  }

  _refreshWindows () {
    if (this.rest.childNodes.length === 0) {
      return
    }

    const height = Math.floor(100.0 / this.rest.childNodes.length).toString() + '%'

    for (const child of this.rest.childNodes) {
      child.style.height = height
    }
  }
}
