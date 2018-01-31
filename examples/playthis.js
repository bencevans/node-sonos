const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

sonos.play('https://archive.org/download/testmp3testfile/mpthreetest.mp3').then(success => {
  console.log('Yeay')
}).catch(err => { console.log('Error occurred %j', err) })
