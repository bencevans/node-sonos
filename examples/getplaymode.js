var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.0.5')

sonos.getPlayMode(function (err, result) {
  console.log([err, result])
})
