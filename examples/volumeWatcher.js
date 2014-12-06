var Sonos = require('../index').Sonos;
var Listener = require('../lib/events/listener');

var device = new Sonos(process.env.SONOS_HOST || '192.168.2.11');
device.startListeners(function() {
  device.on('volumeChanged', function(volume) {
    console.log(volume);
  });
});