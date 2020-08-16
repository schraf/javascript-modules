import * as BufferTests from './buffer_tests.js'
import * as HashTests from './hash_tests.js'
import * as ObjectPoolTests from './objectpool_tests.js'
import * as RandomTests from './random_tests.js'

const output = document.getElementById('output')

function stdout (text) {
  console.log(text)
  const line = document.createElement('div')
  line.innerText = text
  output.appendChild(line)
}

function stderr (text) {
  console.error(text)
  const line = document.createElement('div')
  line.classList.add('error')
  line.innerText = text
  output.appendChild(line)
}

function run (tests) {
  for (const TestClass of Object.values(tests)) {
    const test = new TestClass()
    test.run(stdout, stderr)
  }
}

function main () {
  run(BufferTests)
  run(HashTests)
  run(ObjectPoolTests)
  run(RandomTests)
}

main()
