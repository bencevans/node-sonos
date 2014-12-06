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

LogicalDevice.prototype.initialize = function(cb) {
  async.forEach(this.devices, function(device, done) {
    device.initialize(done);
  }, cb);
};

LogicalDevice.prototype.destroy = function(cb) {
  async.forEach(this.devices, function(device, done) {
    device.destroy(done);
  }, cb);
};

LogicalDevice.prototype.setVolume = function(volume, cb) {
  this.getVolume(function(oldVolume) {

    var diff = volume - oldVolume;

    async.forEach(this.devices, function(device, done) {
      var oldDeviceVolume = device.state.volume;
      var newDeviceVolume = oldDeviceVolume + diff;

      newDeviceVolume = Math.max(newDeviceVolume, 0);
      newDeviceVolume = Math.min(newDeviceVolume, 100);

      device.setVolume(newDeviceVolume, done);

    }, cb);

  }.bind(this));
};

LogicalDevice.prototype.getVolume = function(cb) {

  var sum = 0;

  this.devices.forEach(function(device) {
    sum += device.state.volume || 0;
  });

  cb(sum / this.devices.length);
};

module.exports = LogicalDevice;
