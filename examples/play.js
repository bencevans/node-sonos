var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.play().then(result => {
  console.log('Started playing %j',result)
})

sonos.getVolume().then(volume => {
  console.log('The volume is %d',volume)
})