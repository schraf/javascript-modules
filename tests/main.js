import * as BufferTests from './buffer_tests.js'
import * as CompressTests from './compress_tests.js'
import * as FileSystemTests from './filesystem_tests.js'
import * as FloatTests from './float_tests.js'
import * as HashTests from './hash_tests.js'
import * as ObjectPoolTests from './objectpool_tests.js'
import * as ParserTests from './parser_tests.js'
import * as RandomTests from './random_tests.js'
import * as ServiceWorkerTests from './serviceworker_tests.js'
import * as TokenizerTests from './tokenizer_tests.js'
import * as WASMTests from './wasm_tests.js'

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

async function run (tests) {
  for (const TestClass of Object.values(tests)) {
    const test = new TestClass()
    await test.run(stdout, stderr)
  }
}

async function main () {
  await run(BufferTests)
  await run(CompressTests)
  await run(FileSystemTests)
  await run(FloatTests)
  await run(HashTests)
  await run(ObjectPoolTests)
  await run(ParserTests)
  await run(RandomTests)
  await run(ServiceWorkerTests)
  await run(TokenizerTests)
  await run(WASMTests)
}

main()
