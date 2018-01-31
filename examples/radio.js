const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.1.19', process.env.SONOS_PORT || 1400)

sonos.getFavoritesRadioStations({}).then(radioStations => {
  console.log('Got current radioStations %j', radioStations)
}).catch(err => { console.log('Error occurred %j', err) })

sonos.getFavoritesRadioShows({}).then(radioShows => {
  console.log('Got current track %j', radioShows)
}).catch(err => { console.log('Error occurred %j', err) })
