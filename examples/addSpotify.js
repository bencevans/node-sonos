var SONOS = require('../')
var Sonos = SONOS.Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

var spotifyTrackTd = '5AdoS3gS47x40nBNlNmPQ8' // Slayer ftw

sonos.addSpotify(spotifyTrackTd, function (err, res) {
  console.log(err)
  console.log(res)
})

//
// or if you use spotify EU service
//
var sonosWithSpotifyEU = new Sonos(process.env.SONOS_HOST || '192.168.2.11')
sonosWithSpotifyEU.setRegion(SONOS.SpotifyRegion.EU)

sonosWithSpotifyEU.addSpotify(spotifyTrackTd, function (err, res) {
  console.log(err)
  console.log(res)
})
