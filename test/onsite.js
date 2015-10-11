const assert = require('assert')
const sonos = require('../')

describe('sonos.search()', function () {
  it('finds a sonos device', function (done) {
    sonos.search(function (dev) {
      done()
    })
  })
})
