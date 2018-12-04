const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

// Add a track to the queue
sonos.queue('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3').then(success => {
  console.log('Yeay')
}).catch(err => { console.log('Error occurred %j', err) })

// Read the queue
sonos.getQueue().then(result => {
  console.log('Current queue: %s', JSON.stringify(result, null, 2))
}).catch(err => {
  console.log('Error fetch queue %j', err)
})

// To remove items from the queue
// sonos.removeTracksFromQueue(2, 3).then(result => {
//   console.log('Removed 3 Items from queue starting at position 2')
// })
