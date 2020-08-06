export const FILTER_NEAREST = 0
export const FILTER_LINEAR = 1

class Program {
  constructor (gl, program) {
    this.gl = gl
    this.program = program
    this.positionAttribute = gl.getAttribLocation(program, 'pos')
    this.uniforms = new Map()

    this.setUniformi('tex', 0)
  }

  setUniformi (name, ...values) {
    const components = values.length

    if (components < 1 || components > 4) {
      return
    }

    const location = this._getLocation(name)

    if (location == null) {
      return
    }

    const gl = this.gl
    gl.useProgram(this.program)

    if (components === 1) {
      gl.uniform1i(location, values[0])
    } else if (components === 2) {
      gl.uniform2i(location, values[0], values[1])
    } else if (components === 3) {
      gl.uniform3i(location, values[0], values[1], values[2])
    } else {
      gl.uniform4i(location, values[0], values[1], values[2], values[3])
    }

    gl.useProgram(null)
  }

  setUniformf (name, ...values) {
    const components = values.length

    if (components < 1 || components > 4) {
      return
    }

    const location = this._getLocation(name)

    if (location == null) {
      return
    }

    const gl = this.gl
    gl.useProgram(this.program)

    if (components === 1) {
      gl.uniform1f(location, values[0])
    } else if (components === 2) {
      gl.uniform2f(location, values[0], values[1])
    } else if (components === 3) {
      gl.uniform3f(location, values[0], values[1], values[2])
    } else {
      gl.uniform4f(location, values[0], values[1], values[2], values[3])
    }

    gl.useProgram(null)
  }

  _getLocation (name) {
    let location = this.uniforms.get(name)

    if (location === undefined) {
      location = this.gl.getUniformLocation(this.program, name)

      if (location != null) {
        this.uniforms.set(name, location)
      }
    }

    return location
  }
}

class Context {
  constructor (gl, canvas) {
    this.gl = gl
    this.canvas = canvas
    this.frameBuffer = gl.createFramebuffer()
  }

  enableAlphaBlending () {
    const gl = this.gl
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  }

  compileVertexShader (source) {
    return this._compileShader(this.gl.VERTEX_SHADER, source)
  }

  compileFragmentShader (source) {
    return this._compileShader(this.gl.FRAGMENT_SHADER, source)
  }

  createShaderProgram (vertexShader, fragmentShader) {
    const gl = this.gl
    const shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      return null
    }

    return new Program(gl, shaderProgram)
  }

  createTexture (filter) {
    const gl = this.gl
    const texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, texture)

    if (filter === FILTER_LINEAR) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)

    return texture
  }

  updateTexture (texture, width, height, pixels) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  createArrayBuffer (width, height) {
    const gl = this.gl
    const halfWidth = width * 0.5
    const halfHeight = height * 0.5
    const positions = [-halfWidth, -halfHeight, halfWidth, -halfHeight, halfWidth, halfHeight, -halfWidth, halfHeight]

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return buffer
  }

  renderToTexture (texture, width, height) {
    const gl = this.gl

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.viewport(0, 0, width, height)
  }

  renderToCanvas () {
    const gl = this.gl

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  draw (buffer, texture, shader) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.useProgram(shader.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(shader.positionAttribute, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(shader.positionAttribute)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    gl.disableVertexAttribArray(shader.positionAttribute)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  _compileShader (type, source) {
    const gl = this.gl
    const shader = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }
}

export function createContext (canvas) {
  const gl = canvas.getContext('webgl')

  if (gl === null) {
    return null
  }

  return new Context(gl, canvas)
}
