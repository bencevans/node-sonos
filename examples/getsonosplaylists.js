var Sonos = require('../').Sonos
var sonos = new Sonos('192.168.1.74')

sonos.getMusicLibrary('sonos_playlists', {start: 0, total: 25}, function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})
