var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.play(function (err, playing) {
  console.log([err, playing])
})
