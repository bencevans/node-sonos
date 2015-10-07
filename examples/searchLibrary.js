var Sonos = require('../').Sonos

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.1.19', process.env.SONOS_PORT || 1400)

sonos.searchMusicLibrary('tracks', 'orange crush', function (err, data) {
  console.log(err, data)
})
