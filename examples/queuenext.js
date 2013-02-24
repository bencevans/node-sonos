
var Sonos = require('../').Sonos;
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.queueNext('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3', function(err, playing) {
  console.log([err, playing]);
});