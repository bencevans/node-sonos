
var Sonos = require('../');
var search = Sonos.search();

search.on('DeviceAvailable', function(device) {
  console.log(device);
});