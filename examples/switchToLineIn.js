const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.223')

sonos.getZoneInfo().then(data => {
  // console.log('Got zone info %j', data)
  // The mac is needed for switch to a different channel
  var macCleaned = data.MACAddress.replace(/:/g, '')
  console.log('Cleaned mac %j', macCleaned)

  // To switch on a playbar do the following
  var uri = 'x-sonos-htastream:RINCON_' + macCleaned + '01400:spdif'

  // To switch on a Play:5 and Connect do the following
  // var uri = 'x-rincon-stream:RINCON_' + macCleaned + '01400'

  return sonos.setAVTransportURI(uri).then(result => {
    console.log('Switched to different source!')
  })
}).catch(err => { console.log('Error occurred %j', err) })
