const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

// This example demonstrates playing radio staions
// the Sonos built-in support for tunein radio.

// CAUTION: in older release of node-red the stationId maybe without leading s 
const stationId = 's34682'
const stationTitle = '88.5 | Jazz24 (Jazz)'

sonos.playTuneinRadio(stationId, stationTitle).then(success => {
  console.log('Yeay')
}).catch(err => { console.log('Error occurred %j', err) })
