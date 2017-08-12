var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.getFavorites(function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})
