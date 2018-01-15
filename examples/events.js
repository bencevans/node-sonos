const Sonos = require('../').Sonos
const listener = require('../').Listener
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.56')

listener.on('AlarmsChanged', result => {
  console.log('Alarms changed event')
})
listener.subscribeTo(sonos).then(result => {
  console.log('Subscribed to sonos events')
  console.log('CTRL + C to exit')
})

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
