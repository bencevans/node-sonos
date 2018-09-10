const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.getMusicLibrary('playlists', { start: 0, total: 25 }).then(playlists => {
  console.log('Got current playlists %j', playlists)
}).catch(err => { console.log('Error occurred %j', err) })
