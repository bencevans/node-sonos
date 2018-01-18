var SONOS = require('../')
var Sonos = SONOS.Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

var spotifyTrackTd = 'spotify:track:5AdoS3gS47x40nBNlNmPQ8' // Slayer ftw
sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU)

sonos.queue(spotifyTrackTd).then(result => {
  console.log('Added spotify track to queue %j', result)
}).catch(err => {
  console.log('Error adding %j', err)
})
