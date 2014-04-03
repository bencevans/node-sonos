var Sonos = require('../').Sonos;
var sonos = new Sonos('192.168.1.74');

sonos.getMusicLibrary('playlists', {start: 0, total: 25}, function(err, result){
  console.log([err, result]);
});