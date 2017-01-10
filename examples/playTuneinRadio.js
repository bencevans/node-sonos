var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

// This example demonstrates playing radio staions
// the Sonos built-in support for tunein radio.

var stationId = '34682'
var stationTitle = '88.5 | Jazz24 (Jazz)'

sonos.playSpotifyRadio(stationId, stationTitle, (err, result) => {
  if (err) {
    return console.log(err)
  }
})
