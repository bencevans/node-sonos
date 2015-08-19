var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

var spotify_track_id = '5AdoS3gS47x40nBNlNmPQ8' // Slayer ftw

sonos.addSpotify(spotify_track_id, function (err, res) {
  console.log(err)
  console.log(res)
})
