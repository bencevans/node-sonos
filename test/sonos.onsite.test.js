/* eslint-env mocha */
const assert = require('assert')
const sonos = require('../')

describe('On site Sonos', function () {
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

  describe('Favorites Radio', function () {
    var device = null

    before(function (done) {
      sonos.search(function (dev) {
        device = dev
        done()
      })
    })

    it('should return favorite radio stations', function (done) {
      device.getFavoritesRadioStations({}, function (err, result) {
        assert(err !== false)
        assert(result)
        done()
      })
    })

    it('should return favorite radio shows', function (done) {
      device.getFavoritesRadioShows({}, function (err, result) {
        assert(err !== false)
        assert(result)
        done()
      })
    })
  })
})
