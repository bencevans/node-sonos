/* eslint-env mocha */
const sonos = require('../')

describe('Search Music Library', function () {
  var device = null

  before(function (done) {
    sonos.search(function (dev) {
      device = dev
      done()
    })
  })

  it('returns search results from the Sonos library', function (done) {
    // TODO: Verify data response
    device.searchMusicLibrary('tracks', 'Newton', {}, done)
  })
})
