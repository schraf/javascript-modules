class Element {
  constructor (type, parent) {
    this.element = document.createElement(type)
    this.parent = parent || null
  }

  id (name) {
    this.element.id = name
    return this
  }

  class (name) {
    this.element.classList.add(name)
    return this
  }

  attr (name, value) {
    this.element.setAttribute(name, value || '')
    return this
  }

  style (name, value) {
    this.element.style.setProperty(name, value)
    return this
  }

  on (event, callback) {
    this.element.addEventListener(event, callback)
    return this
  }

  once (event, callback) {
    this.element.addEventListener(event, callback, { once: true })
    return this
  }

  text (text) {
    this.element.innerText = text
    return this
  }

  html (html) {
    this.element.innerHTML = html
    return this
  }

  child (type, func) {
    const child = new Element(type, this)
    this.element.appendChild(child.element)

    if (func) {
      func(child)
    }

    return child
  }

  parent () {
    return this.parent
  }
}

export function element (type, parent) {
  const element = new Element(type)

  if (parent != null) {
    parent.appendChild(element.element)
  }

  return element
}
