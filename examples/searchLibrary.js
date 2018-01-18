const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.1.19', process.env.SONOS_PORT || 1400)

sonos.searchMusicLibrary('tracks', 'orange crush', {}).then(results => {
  console.log('Got search results %j', results)
}).catch(err => { console.log('Error occurred %j', err) })
