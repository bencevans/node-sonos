var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.next(function (err, nexted) {
  if (!err || !nexted) {
    console.log('Complete')
  } else {
    console.log('OOOHHHHHH NOOOO')
  }
})
