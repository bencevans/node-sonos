var Sonos = require('../').Sonos
var Regions = require('../').SpotifyRegion
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')
sonos.setSpotifyRegion(Regions.EU)
// This example demonstrates playing various spotify uri types.
// The Spotify uris can be obtained by using the Spotify
// REST apis:
//     https://developer.spotify.com/web-api/console/
//
// Or by using a scoped internet search and scraping the results:
//    e.g. "A night at the opera site:spotify.com"
//
// And right from spotify, click the three dots => share => Copy spotify uri
//
// Spotify uri examples:
//     Bohemian Rhapsody track - spotify:track:1AhDOtG9vPSOmsWgNW0BEY
//     A night at the opera album - spotify:album:1TSZDcvlPtAnekTaItI3qO
//     Top tracks by Queen - spotify:artistTopTracks:1dfeR4HaWDbWqFHLkxsg1d
//     Top Tracks by Guus Meeuwis spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv
//     Queen playlist (public user) - spotify:user:lorrainehelen:playlist:2ytnaITywUiPoS9JDYig5I
//     Summer rewind by Spotify - spotify:user:spotify:playlist:37i9dQZF1DWSBi5svWQ9Nk
//
// This assumes you have the Spotify music service connected to
// your Sonos system.

var spotifyUri = 'spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv'

sonos.play(spotifyUri, (err, result) => {
  if (err) {
    return console.log(err)
  }
})

// This example plays curated artist radio on Spotify. The
// artistId is found in the same way as described above. The
// artistName is just a string to be used in the Sonos Queue
// as the name for the radio station playlist.

// var artistId = '1dfeR4HaWDbWqFHLkxsg1d'
// var artistName = 'Queen'

// sonos.playSpotifyRadio(artistId, artistName, (err, result) => {
//   if (err) {
//     return console.log(err)
//   }
// })
