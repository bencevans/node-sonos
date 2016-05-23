var Sonos = require('../').Sonos
var sonos = new Sonos('192.168.2.11')

sonos.stop(function (err, stopped) {
  console.log([err, stopped])
})
