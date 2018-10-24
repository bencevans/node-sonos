const Sonos = require('../')

console.log('Searching for Sonos devices...')
const search = Sonos.DeviceDiscovery({ timeout: 30000 })

search.on('DeviceAvailable', function (device, model) {
  console.log(device, model)
})

// Optionally stop searching and destroy after some time
setTimeout(function () {
  console.log('Stop searching for Sonos devices')
}, 30000)
