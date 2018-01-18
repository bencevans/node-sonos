const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.play().then(result => {
  console.log('Started playing %j', result)
}).catch(err => { console.log('Error occurred %j', err) })

sonos.getVolume().then(volume => {
  console.log('The volume is %d', volume)
}).catch(err => { console.log('Error occurred %j', err) })
