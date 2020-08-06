export function display (element, buffer) {
  const length = buffer.byteLength
  const view = new Uint8Array(buffer)

  while (element.lastChild !== null) {
    element.removeChild(element.lastChild)
  }

  for (let offset = 0; offset < length; offset += 16) {
    const line = document.createElement('div')
    const address = document.createElement('span')
    const bytes = document.createElement('span')
    const ascii = document.createElement('span')

    line.classList.add('hex-line')
    line.style.display = 'flex'
    line.style.flexDirection = 'row'

    address.classList.add('hex-line-address')
    address.style.flex = '10'
    address.innerText = `${offset.toString(16).padStart(8, '0')}: `

    bytes.classList.add('hex-line-bytes')
    bytes.style.flex = '48'

    ascii.classList.add('hex-line-ascii')
    ascii.style.flex = '16'

    for (let i = 0; i < 16; i++) {
      if (offset + i >= length) {
        break
      }

      const code = view[offset + i]

      bytes.innerText += view[offset + i].toString(16).padStart(2, '0')
      bytes.innerText += ' '

      if (code >= 33 && code <= 126) {
        ascii.innerText += String.fromCharCode(code)
      } else {
        ascii.innerText += '.'
      }
    }

    line.appendChild(address)
    line.appendChild(bytes)
    line.appendChild(ascii)
    element.appendChild(line)
  }
}
