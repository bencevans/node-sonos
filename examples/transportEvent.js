var Sonos = require('../index').Sonos
var Listener = require('../lib/events/listener')

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.55')
var x = new Listener(sonos, {'interface': 'public'}) // Specify interface name when using multiple interfaces. or public for default.
x.listen(function (err) {
  if (err) throw err

  x.addService('/MediaRenderer/AVTransport/Event', function (error, sid) {
    if (error) throw err
    console.log('Successfully subscribed, with subscription id', sid)
  })

  x.on('serviceEvent', function (endpoint, sid, data) {
    // It's a shame the data isn't in a nice track object, but this might need some more work.
    // At this moment we know something is changed, either the play state or an other song.
    console.log('Received event from', endpoint, '(' + sid + ') with data:', data, '\n\n')
    sonos.currentTrack(function (err, track) {
      console.log(err, track)
    })
  })
})
