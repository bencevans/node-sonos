const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56')

sonos.getQueue().then(result => {
  console.log('Current queue: %s', JSON.stringify(result, null, 2))
}).catch(err => {
  console.log('Error fetch queue %j', err)
})
