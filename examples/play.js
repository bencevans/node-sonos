
var Sonos = require('../').Sonos;
var sonos = new Sonos('192.168.2.11');

sonos.play(function(err, playing) {
  console.log([err, playing]);
});