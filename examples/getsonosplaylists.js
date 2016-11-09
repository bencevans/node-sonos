var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.getMusicLibrary('sonos_playlists', {start: 0, total: 25}, function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})
