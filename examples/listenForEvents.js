var Sonos = require('../index').Sonos

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56')

// You don't need to call startListening anymore, is called implicit by subscribing
// You can however if you want to specify a certain interface.
// sonos.startListening(function (err, success) {
//   console.log('Error startListening %s', err)
// })

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
