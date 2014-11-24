var async = require('async'),
    Sonos = require('./sonos').Sonos,
    util = require('util');

function LogicalDevice(devices) {
  if (devices.length === 0) {
    throw new Error('Logical device must be initialized with at least one device (' + devices.length + ' given)');
  }

  Sonos.call(this, devices[0].host, devices[0].port);
  var sonosDevices = devices.map(function(device) {
    return new Sonos(device.host, device.post);
  });

  this.devices = sonosDevices;
}

util.inherits(LogicalDevice, Sonos);

LogicalDevice.prototype.setVolume = function(volume, cb) {
  this.getVolume(function(oldVolume) {
    var diff = volume - oldVolume;
    async.forEach(this.devices, function(device, done) {
      device.getVolume(function(err, oldDeviceVolume) {
        var newDeviceVolume = oldDeviceVolume + diff;
        newDeviceVolume = Math.max(newDeviceVolume, 0);
        newDeviceVolume = Math.min(newDeviceVolume, 100);
        device.setVolume(newDeviceVolume, done);
      });
    }, cb);
  }.bind(this));
};

LogicalDevice.prototype.getVolume = function(cb) {
  var results = [];

  async.forEach(this.devices, function(device, done) {
    device.getVolume(function(err, vol) {
      results.push(vol);
      done();
    });
  }, function(err) {
    if (err) cb(err);
    else {
      var sum = results.reduce(function(vol, acc) { return vol + acc; });
      cb(sum / results.length);
    }
  });
};

module.exports = LogicalDevice;
