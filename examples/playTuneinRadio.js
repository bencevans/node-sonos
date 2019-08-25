const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

// This example demonstrates playing radio staions
// the Sonos built-in support for tunein radio.

// CAUTION: ID is with leading s since version 1.12.1
const stationId = 's34682'
const stationTitle = '88.5 | Jazz24 (Jazz)'

sonos.playTuneinRadio(stationId, stationTitle).then(success => {
  console.log('Yeay')
}).catch(err => { console.log('Error occurred %j', err) })
