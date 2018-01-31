const Sonos = require('../').Sonos
const listener = require('../').Listener
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56')

console.log('Listen for sonos events. CTRL + C to exit')
// Subscribe to global events. They are emitted on the listener.
listener.on('AlarmClock', result => {
  console.log('Alarms changed event %j', result)
})

listener.on('ZoneGroupTopology', result => {
  console.log('Zone group topology event, got info about all current groups')
})

// Manually subscribe to a events from a sonos speaker
listener.subscribeTo(sonos).then(result => {
  console.log('Manually subscribed to sonos events')
})

// Or start listening for events on the sonos itself, will call the listener in the background
sonos.on('CurrentTrack', track => {
  console.log('Track changed to %s by %s', track.title, track.artist)
})

sonos.on('NextTrack', track => {
  console.log('The next track will be %s by %s', track.title, track.artist)
})

sonos.on('Volume', volume => {
  console.log('New Volume %d', volume)
})

sonos.on('Mute', isMuted => {
  console.log('This speaker is %s.', isMuted ? 'muted' : 'unmuted')
})

sonos.on('PlayState', state => {
  console.log('The state changed to %s.', state)
})

sonos.on('AVTransport', transport => {
  console.log('AVTransport event %j', transport)
})

// Subscribe to the CTRL + C event and cancel the current subscribtions
process.on('SIGINT', () => {
  console.log('Hold-on cancelling all subscriptions')
  listener.stopListener().then(result => {
    console.log('Cancelled all subscriptions')
    process.exit()
  }).catch(err => {
    console.log('Error cancelling subscriptions, exit in 3 seconds  %s', err)
    setTimeout(() => {
      process.exit(1)
    }, 2500)
  })
})
