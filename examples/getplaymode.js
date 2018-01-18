const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.0.5')

sonos.getPlayMode().then(playmode => {
  console.log('Got current playmode %j', playmode)
}).catch(err => { console.log('Error occurred %j', err) })
