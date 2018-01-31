const Sonos = require('../index').Sonos
const listener = require('../').Listener

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.55')
// Just subscribe to the event you want.
// see events.js for more events.
sonos.on('AVTransport', event => {
  console.log('AVTransport event %j', event)
})

// Just keep listening until CTRL + C is pressed
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
