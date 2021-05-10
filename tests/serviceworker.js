import * as ServiceWorker from '../serviceworker.js'

const version = 'serviceworker_test_v1'
const assets = []

async function handler (request) {
  // TODO: add test data
  return null;
}

ServiceWorker.init(version, assets, handler)
