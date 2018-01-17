/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'events'
 * @requires 'dgram'
 * @requires './sonos'
 */

const dgram = require('dgram')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const Sonos = require('./sonos').Sonos

/**
 * Create a new instance of DeviceDiscovery
 * @class DeviceDiscovery
 * @emits 'DeviceAvailable' on a Sonos Component Discovery
 */
var DeviceDiscovery = function DeviceDiscovery (options) {
  var self = this
  self.foundSonosDevices = {}
  self.onTimeout = function () {
    clearTimeout(self.pollTimer)
  }
  var PLAYER_SEARCH = Buffer.from(['M-SEARCH * HTTP/1.1',
    'HOST: 239.255.255.250:1900',
    'MAN: ssdp:discover',
    'MX: 1',
    'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'))
  var sendDiscover = function () {
    ['239.255.255.250', '255.255.255.255'].map(function (addr) {
      self.socket.send(PLAYER_SEARCH, 0, PLAYER_SEARCH.length, 1900, addr)
    })
      // Periodically send discover packet to find newly added devices
    self.pollTimer = setTimeout(sendDiscover, 10000)
      // Remove the on timeout listener and add back in every iteration
    self.removeListener('timeout', self.onTimeout)
    self.on('timeout', self.onTimeout)
  }
  this.socket = dgram.createSocket('udp4', function (buffer, rinfo) {
    buffer = buffer.toString()
    if (buffer.match(/.+Sonos.+/)) {
      var modelCheck = buffer.match(/SERVER.*\((.*)\)/)
      var model = (modelCheck.length > 1 ? modelCheck[1] : null)
      var addr = rinfo.address
      if (!(addr in self.foundSonosDevices)) {
        var sonos = self.foundSonosDevices[addr] = new Sonos(addr)
        self.emit('DeviceAvailable', sonos, model)
      }
    }
  })
  this.socket.on('close', function () {
    if (self.searchTimer) {
      clearTimeout(self.searchTimer)
    }
    clearTimeout(self.pollTimer)
  })
  this.socket.on('error', function (err) {
    self.emit('error', err)
  })
  this.socket.bind(options, function () {
    self.socket.setBroadcast(true)
    sendDiscover()
  })
  if (options.timeout) {
    self.searchTimer = setTimeout(function () {
      self.socket.close()
      self.emit('timeout')
    }, options.timeout)
  }
  return this
}
util.inherits(DeviceDiscovery, EventEmitter)

  /**
   * Destroys DeviceDiscovery class, stop searching, clean up
   * @param  {Function} callback ()
   */
DeviceDiscovery.prototype.destroy = function (callback) {
  clearTimeout(this.searchTimer)
  clearTimeout(this.pollTimer)
  this.socket.close(callback)
}

  /**
   * Create a DeviceDiscovery Instance (emits 'DeviceAvailable' with a found Sonos Component)
   * @param  {Object} options Optional Options to control search behavior.
   *                          Set 'timeout' to how long to search for devices
   *                          (in milliseconds).
   * @param  {Function} listener Optional 'DeviceAvailable' listener (sonos)
   * @return {DeviceDiscovery}
   */
var deviceDiscovery = function (options, listener) {
  if (typeof options === 'function') {
    listener = options
    options = null
  }
  options = options || {}
  listener = listener || null
  var search = new DeviceDiscovery(options)
  if (listener !== null) {
    search.on('DeviceAvailable', listener)
  }
  return search
}

module.exports = deviceDiscovery
