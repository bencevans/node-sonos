/* eslint-env mocha */
const assert = require('assert')
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

  it('should return Sonos playlists', function (done) {
    device.searchMusicLibrary('sonos_playlists', null, {}, function (err, result) {
      assert(err !== false)
      assert(result)
      done()
    })
  })
})
