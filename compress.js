export function compress (input) {
  let pos = 0
  const compressed = []

  while (pos < input.length) {
    let prefix = Math.max(pos - 255, 0)
    let len = 0
    let off = 0
    const maxLength = Math.min(pos + 255, input.length) - pos

    while (prefix < pos) {
      for (let i = 0; i < maxLength; ++i) {
        if (input[prefix + i] !== input[pos + i]) {
          break
        }

        if (i + 1 >= len) {
          len = i + 1
          off = pos - prefix
        }
      }

      prefix++
    }

    pos += len + 1
    compressed.push(off, len, input[pos - 1])
  }

  return Uint8Array.from(compressed).buffer
}

export function decompress (input) {
  const uncompressed = []

  for (let i = 0; i < input.length; i += 3) {
    const off = input[i]
    const len = input[i + 1]
    const value = input[i + 2]

    if (len > 0) {
      const pos = uncompressed.length - off

      for (let j = 0; j < len; ++j) {
        uncompressed.push(uncompressed[pos + j])
      }
    }

    uncompressed.push(value)
  }

  return Uint8Array.from(uncompressed).buffer
}
