const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.getFavorites().then(favorites => {
  console.log('Got current favorites %j', favorites)
}).catch(err => { console.log('Error occurred %j', err) })
