var Sonos = require('../sonos').Sonos;

var SERVICE_ENDPOINT = '/MediaRenderer/RenderingControl/Event';

var initVolumeListener = function(baseListener, cb) {

  baseListener.addHandler(SERVICE_ENDPOINT, function(data) {

    baseListener.parser.parseString(data.LastChange, function(err, result) {
      baseListener.device.state.volume = parseInt(result.Event['InstanceID'][0]['Volume'][0]['$']['val']);
      baseListener.device.emit('volumeChange', baseListener.device.state.volume);
    });

  }, cb);

};

module.exports = initVolumeListener;