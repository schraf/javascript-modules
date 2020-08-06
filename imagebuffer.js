/* eslint-env browser */

export class ImageBuffer {
  constructor () {
    this.width = 0
    this.height = 0
    this.pixels = null
  }

  init (width, height) {
    this.width = width
    this.height = height
    this.pixels = new Uint8Array(new ArrayBuffer(width * height * 4))
  }

  load (url, cors) {
    return new Promise(resolve => {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)

        const data = ctx.getImageData(0, 0, image.width, image.height)

        this.width = image.width
        this.height = image.height
        this.pixels = data.data

        resolve(this)
      }

      if (cors) {
        image.crossOrigin = 'Anonymous'
      }

      image.src = url
    })
  }

  clear () {
    this.pixels.fill(0)
  }

  set (x, y, r, g, b, a) {
    const index = y * this.width * 4 + x * 4
    this.pixels[index] = r
    this.pixels[index + 1] = g
    this.pixels[index + 2] = b
    this.pixels[index + 3] = a
  }
}
