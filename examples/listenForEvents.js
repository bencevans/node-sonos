var Sonos = require('../index').Sonos

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56')

sonos.startListening(function (err) {
  console.log('Error startListening %s', err)
})

sonos.on('StateChanged', state => {
  console.log('State changed to %s', state)
})

sonos.on('TrackChanged', track => {
  console.log('Current track %s', track.title)
})

sonos.on('VolumeChanged', volume => {
  console.log('Volume changed to %s', volume)
})

sonos.on('Muted', muted => {
  console.log('Sonos muted %s', muted)
})

process.on('SIGINT', function () {
  console.log('Shutting down listener')
  sonos.stopListening(function () {
    process.exit()
  })
})
