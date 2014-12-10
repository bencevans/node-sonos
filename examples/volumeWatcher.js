var Sonos = require('../index').Sonos;

var device = new Sonos(process.env.SONOS_HOST || '192.168.2.11');
device.initialize(function() {
  device.on('volumeChange', function(volume) {
    console.log(volume);
  });
});
