var assert = require('assert');
var Sonos = require('../index').Sonos;

describe('Sonos', function() {

	it('queueNext() should generate proper xml', function(done) {
		var sonos = new Sonos('localhost', 1400);
				
		sonos.request = function(endpoint, action, body) {
			assert(endpoint === '/MediaRenderer/AVTransport/Control');
			assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"');
			assert(body === '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>');
			done();
		};

		sonos.queueNext('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3', function() { });

	});
});