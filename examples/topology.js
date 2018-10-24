const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.57')

sonos.getAllGroups().then(groups => {
  console.log('All groups %s', JSON.stringify(groups, null, 2))
}).catch(err => {
  console.warn('Error loading topology %s', err)
})

sonos.zoneGroupTopologyService().GetZoneGroupAttributes().then(attributes => {
  console.log('All Zone attributes %s', JSON.stringify(attributes, null, 2))
}).catch(console.warn)

// sonos.joinGroup('Slaapkamer').then(console.log).catch(console.warn)
