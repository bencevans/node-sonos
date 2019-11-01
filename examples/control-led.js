const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56', process.env.SONOS_PORT || 1400)

sonos.getLEDState().then(state => {
  console.log('Current LED state %j', state)
}).catch(err => { console.log('Error occurred %j', err) })

sonos.setLEDState('On').then(result => {
  console.log('Led changed to Off success %j', result)
}).catch(err => { console.log('Error occurred %j', err) })
