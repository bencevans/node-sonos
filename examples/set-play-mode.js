const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56', process.env.SONOS_PORT || 1400)

// const playmodes = ['NORMAL', 'REPEAT_ONE', 'REPEAT_ALL', 'SHUFFLE', 'SHUFFLE_NOREPEAT', 'SHUFFLE_REPEAT_ONE']

sonos.setPlayMode('SHUFFLE').then(success => {
  console.log('Changed playmode success')
}).catch(err => { console.log('Error occurred %s', err) })
