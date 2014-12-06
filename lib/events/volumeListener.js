var Sonos = require('../sonos').Sonos;

var SERVICE_ENDPOINT = '/MediaRenderer/RenderingControl/Event';

var initVolumeListener = function(baseListener, cb) {

  baseListener.on('serviceEvent', function(endpoint, sid, data) {
    if (endpoint == SERVICE_ENDPOINT) {
      baseListener.parser.parseString(data.LastChange, function(err, result) {
        baseListener.device.state.volume = parseInt(result.Event['InstanceID'][0]['Volume'][0]['$']['val']);
        baseListener.device.emit('volumeChange', baseListener.device.state.volume);
      });
    }
  });

  baseListener.addService(SERVICE_ENDPOINT, cb);
};

module.exports = initVolumeListener;