var Sonos = require('../').Sonos;

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.19', process.env.SONOS_PORT || 1400);

sonos.queueSpotify('6ouTGbETM7ZdID1eMXZJde', function(err, data) {
	console.log(err, data);
});