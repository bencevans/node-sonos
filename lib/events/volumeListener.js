var Sonos = require('../sonos').Sonos;

var SERVICE_ENDPOINT = '/MediaRenderer/RenderingControl/Event';

var initVolumeListener = function(baseListener, callback) {

  var initialized = false;

  baseListener.addHandler(SERVICE_ENDPOINT, function(data) {

    // wait for initial data before callback
    if (!initialized) {
      initialized = true;
      callback(null);
    }

    baseListener.parser.parseString(data.LastChange, function(err, result) {
      baseListener.device.state.volume = parseInt(result.Event['InstanceID'][0]['Volume'][0]['$']['val']);
      baseListener.device.emit('volumeChange', baseListener.device.state.volume);
    });

  }, function(err) {
    if (err) callback(err);
  });

};

module.exports = initVolumeListener;