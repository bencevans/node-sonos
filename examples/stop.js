const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.19', process.env.SONOS_PORT || 1400)

sonos.stop().then(result => {
  console.log('Stopped playing %j', result)
}).catch(err => { console.log('Error occurred %j', err) })
