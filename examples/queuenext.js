const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.queueNext('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3').then(success => {
  console.log('Yeay')
}).catch(err => { console.log('Error occurred %j', err) })
