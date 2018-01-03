var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.223')

sonos.getZoneInfo((err,data)=>{
    
    if(err){
        console.log('Got error %j', err)
        return
    }
    // console.log('Got zone info %j', data)
    // The mac is needed for switch to a different channel
    var macCleaned = data.MACAddress.replace(/:/g, '')
    console.log('Cleaned mac %j',macCleaned)

    // To swtich on a playbar do the following
    var uri = 'x-sonos-htastream:RINCON_' + macCleaned + '01400:spdif'

    // To switch on a Play:5 do the following
    //var uri = 'x-ricon-stream:RINCON_' + macCleaned + '01400'

    sonos.playWithoutQueue(uri, (err, playing)=> {
        if(err){
            console.log('Got error %j',err)
        } else {
            console.log('Playing: %j',playing)
        }
    })
})
