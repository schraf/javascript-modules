import { UnitTest } from './test.js'
import * as ServiceWorker from '../serviceworker.js'

export class TestServiceWorker extends UnitTest {
  constructor () {
    super('serviceworker')
  }

  async test () {
    this.assert(await ServiceWorker.register('/serviceworker.js'))
  }
}
