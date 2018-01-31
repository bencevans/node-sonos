const sonos = require('../')

sonos.DeviceDiscovery(function (sonos) {
  console.log('Found Sonos \'%s\'', sonos.host)
  sonos.getCurrentState().then(state => {
    console.log('Sonos host %s state %s', sonos.host, state)
  }).catch(err => { console.log('Error occurred %j', err) })
})
