var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.53')

// You can join an other group just by the name of one of the members of that group.
// You don't have to worry about who is the coordinator.
var deviceToJoin = 'Office'
sonos.joinGroup(deviceToJoin, (err, success) => {
  if (err) {
    console.log('Error joining group %j', err)
    return
  }

  console.log('Joining %s is a %s', deviceToJoin, (success ? 'Success' : 'Failure'))
})

// This way you can leave the group. It will also return success === true, if the device wasn't in a group though.
sonos.leaveGroup((err, success) => {
  if (err) {
    console.log('Error leaving group %j', err)
    return
  }

  console.log('Leaving the group is a %s', (success ? 'Success' : 'Failure'))
})
