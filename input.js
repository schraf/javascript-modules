export const KEY_ALT = 'Alt'
export const KEY_CTRL = 'Control'
export const KEY_SHIFT = 'Shift'
export const KEY_ENTER = 'Enter'
export const KEY_TAB = 'Tab'
export const KEY_UP = 'ArrowUp'
export const KEY_DOWN = 'ArrowDown'
export const KEY_LEFT = 'ArrowLeft'
export const KEY_RIGHT = 'ArrowRight'
export const KEY_HOME = 'Home'
export const KEY_END = 'End'
export const KEY_PGDN = 'PageDown'
export const KEY_PGUP = 'PageUp'
export const KEY_BACKSPACE = 'Backspace'
export const KEY_DEL = 'Delete'
export const KEY_INSERT = 'Insert'

const keymap = new Map()
const keystate = new Map()
let defaultHandler = null

class KeyCommand {
  constructor (handler, keys) {
    this.handler = handler
    this.keys = keys
  }
}

export function register (id, handler, ...keys) {
  keymap.set(id, new KeyCommand(handler, keys))
}

export function unregister (id) {
  keymap.delete(id)
}

export function catchall (handler) {
  defaultHandler = handler
}

export function paste () {
  navigator.clipboard.readText().then(text => {
    for (const key of text.split('')) {
      if (defaultHandler !== null) {
        defaultHandler(key)
      }
    }
  })
}

function onKeyDown (event) {
  keystate.set(event.key, true)
  let handled = false

  for (const command of keymap.values()) {
    let trigger = true
    let hasKey = false

    for (const key of command.keys) {
      if (!keystate.get(key)) {
        trigger = false
        break
      }

      if (key === event.key) {
        hasKey = true
      }
    }

    if (hasKey && trigger) {
      command.handler()
      event.preventDefault()
      handled = true
      break
    }
  }

  if (!handled && defaultHandler !== null) {
    defaultHandler(event.key)
  }
}

function onKeyUp (event) {
  keystate.set(event.key, false)
}

document.body.addEventListener('keydown', onKeyDown)
document.body.addEventListener('keyup', onKeyUp)
