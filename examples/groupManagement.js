const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.53')

// You can join an other group just by the name of one of the members of that group.
// You don't have to worry about who is the coordinator.
const deviceToJoin = 'Office'
sonos.joinGroup(deviceToJoin).then(success => {
  console.log('Joining %s is a %s', deviceToJoin, (success ? 'Success' : 'Failure'))
}).catch(err => {
  console.log('Error joining device %j', err)
})

// This way you can leave the group. It will also return success === true, if the device wasn't in a group though.
sonos.leaveGroup().then(success => {
  console.log('Leaving the group is a %s', (success ? 'Success' : 'Failure'))
}).catch(err => {
  console.log('Error joining device %j', err)
})
