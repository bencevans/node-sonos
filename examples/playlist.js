const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.createPlaylist('Test').then(result => {
  console.log('Created playlist: %j', result)
}).catch(result => { console.log('Error occurred: %j', result) })

sonos.deletePlaylist(5).then(() => {
  console.log('Deleted playlist')
}).catch(() => { console.log('Error occurred') })

sonos.addToPlaylist(1, 'x-file-cifs://localhost/Music/Song.mp3').then(result => {
  console.log('Added to playlist: %j', result)
}).catch(result => { console.log('Error occurred: %j', result) })

sonos.removeFromPlaylist(1, 2).then(result => {
  console.log('Removed from playlist: %j', result)
}).catch(result => { console.log('Error occurred: %j', result) })
