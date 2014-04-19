
var Sonos = require('../');
var search = Sonos.search();

search.on('DeviceAvailable', function(device, model) {
  console.log(device, model);
});