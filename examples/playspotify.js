var Sonos = require('../').Sonos;

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.19', process.env.SONOS_PORT || 1400);

sonos.queueSpotify('6EKQbI0jKua5AehBsicMdD', function(err, data) {
	console.log(err, data);
});