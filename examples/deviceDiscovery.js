const Sonos = require('../')

console.log('Searching for Sonos devices for 10 seconds...')

const discovery = new Sonos.AsyncDeviceDiscovery()

// discovery.discover({ port: 50333, timeout: 10000 }).then((device, model) => {
//   console.log('Found one sonos device %s getting all groups', device.host)
//   return device.getAllGroups().then((groups) => {
//     console.log('Groups %s', JSON.stringify(groups, null, 2))
//     //return groups[0].CoordinatorDevice().togglePlayback()
//   })
// }).catch(e => {
//   console.warn(' Error in discovery %o', e)
// })

discovery.discoverMultiple({ port: 50333, timeout: 10000 }).then((devices) => {
  console.log('Found %d sonos devices', devices.length)
  devices.forEach(device => {
    console.log('Device IP: %s', device.host)
  })
}).catch(e => {
  console.warn(' Error in discovery %j', e)
})

// const discovery = new Sonos.DeviceDiscovery({}, (device, model) => {
//   console.log('Found one sonos device %s', device.host)
//   process.exit(0);
// })
