var async = require('async')
var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

// This example demonstrates playing various spotify uri types.
// Just replace the spotify uri used in the Play command below
// with your own. These uris can be obtained by using the Spotify
// REST apis:
//     https://developer.spotify.com/web-api/console/
//
// Or by using a scoped internet search and scraping the results:
//    e.g. "A night at the opera site:spotify.com"
//
// Spotify uri examples:
//     Bohemian Rhapsody track - spotify:track:1AhDOtG9vPSOmsWgNW0BEY
//     A night at the opera album - spotify:album:1TSZDcvlPtAnekTaItI3qO
//     Top tracks by Queen - spotify:artistTopTracks:1dfeR4HaWDbWqFHLkxsg1d
//     Queen playlist (public user) - spotify:user:lorrainehelen:playlist:2ytnaITywUiPoS9JDYig5I
//
// The sample code below selects the queue, clears it, sets the volume
// and then plays the music through the Spotify service by specifying
// the appropriate Spotify uri.
//
// This assumes you have the Spotify music service connected to
// your Sonos system.

var spotifyUri = 'spotify:track:1AhDOtG9vPSOmsWgNW0BEY'

playSpotifyUri(spotifyUri, (err, result) => {
  if (err) {
    return console.log('playSpotifyUri failed')
  }
  if (!spotifyUri) {
    return console.log('Missing artistId param in playSpotifyUri')
  }
  if (!this.sonos) {
    return callback('No Sonos controller found')
  }
  async.series([
    (next) => {
      this.sonos.selectQueue((err, selectQueueResult) => {
        if (err) {
          return next(err)
        }
        return next(null)
      })
    },
    (next) => {
      this.sonos.flush((err, flushQueueResult) => {
        if (err) {
          return next(err)
        }
        return next(null)
      })
    },
    (next) => {
      this.sonos.setVolume('25', (err, volumeResult) => {
        if (err) {
          return next(err)
        }
        return next(null)
      })
    },
    (next) => {
      this.sonos.play(spotifyUri, (err, playResult) => {
        if (err) {
          return next(err)
        }
        return next(null)
      })
    }
  ], (err) => {
    if (err) {
      return console.log('Error playing Spotify uri')
    }
    return console.log(null, 'Succeeded')
  })
})

// This example plays curated artist radio on Spotify. The
// artistId is found in the same way as described above. The
// artistName is just a string to be used in the Sonos Queue
// as the name for the radio station playlist.

var artistId = '1dfeR4HaWDbWqFHLkxsg1d'
var artistName = 'Queen'

sonos.playSpotifyRadio(artistId, artistName, (err, result) => {
  if (err) {
    return console.log(err)
  }
})
