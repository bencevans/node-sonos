
var Sonos = require('../').Sonos;
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.play('https://archive.org/download/testmp3testfile/mpthreetest.mp3', function(err, playing) {
  console.log([err, playing]);
});