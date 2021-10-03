/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'events'
 * @requires 'dgram'
 * @requires './sonos'
 */

const dgram = require('dgram')
const EventEmitter = require('events').EventEmitter
const Sonos = require('./sonos').Sonos

const PLAYER_SEARCH = Buffer.from(['M-SEARCH * HTTP/1.1',
  'HOST: 239.255.255.250:1900',
  'MAN: ssdp:discover',
  'MX: 1',
  'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'))

/**
 * Create a new instance of DeviceDiscovery
 * @class DeviceDiscovery
 * @emits 'DeviceAvailable' on a Sonos Component Discovery
 */
class DeviceDiscovery extends EventEmitter {
  constructor (options) {
    super()
    // this.options = options
    this.foundSonosDevices = {}
    this.socket = dgram.createSocket('udp4')

    this.socket.on('message', (buffer, rinfo) => {
      const data = buffer.toString()
      if (data.match(/.+Sonos.+/)) {
        const modelCheck = data.match(/SERVER.*\((.*)\)/)
        const model = (modelCheck.length > 1 ? modelCheck[1] : null)
        const addr = rinfo.address
        if (!(addr in this.foundSonosDevices)) {
          const sonos = this.foundSonosDevices[addr] = new Sonos(addr)
          this.emit('DeviceAvailable', sonos, model)
        }
      }
    })

    this.socket.on('close', () => {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      clearTimeout(this.pollTimer)
    })

    this.socket.on('error', (err) => {
      this.emit('error', err)
    })

    this.socket.on('listening', () => {
      // console.log('UDP port %d opened for discovery', this.socket.address().port)
      this.socket.setBroadcast(true)
      this.sendDiscover()
    })

    this.socket.bind(options.port)

    if (options && options.timeout) {
      this.searchTimer = setTimeout(() => {
        this.socket.close()
        this.emit('timeout')
      }, options.timeout)
    }
  }

  onTimeout () {
    clearTimeout(this.pollTimer)
  }

  sendDiscover () {
    this.sendDiscoveryOnAddress('239.255.255.250')
    this.sendDiscoveryOnAddress('255.255.255.255')

    // Periodically send discover packet to find newly added devices
    this.pollTimer = setTimeout(() => {
      this.sendDiscover()
    }, 10000)
    // Remove the on timeout listener and add back in every iteration
    this.removeListener('timeout', this.onTimeout)
    this.on('timeout', this.onTimeout)
  }

  sendDiscoveryOnAddress (address) {
    this.socket.send(PLAYER_SEARCH, 0, PLAYER_SEARCH.length, 1900, address, (err, bytes) => {
      if (err) {
        console.error(err)
      }
    })
  }

  destroy () {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
    }
    this.socket.close()
  }
}

/**
   * Create a DeviceDiscovery Instance (emits 'DeviceAvailable' with a found Sonos Component)
   * @param  {Object} options Optional Options to control search behavior.
   *                          Set 'timeout' to how long to search for devices
   *                          (in milliseconds).
   *                          Set 'port' to use a specific inbound UDP port,
   *                          rather than a randomly assigned one
   * @param  {(device: Sonos, model: string) => void | undefined} listener Optional 'DeviceAvailable' listener (sonos)
   * @return {DeviceDiscovery}
   */
const deviceDiscovery = function (options, listener = undefined) {
  if (typeof options === 'function') {
    listener = options
    options = undefined
  }
  options = options || {}
  listener = listener || undefined
  const search = new DeviceDiscovery(options)
  if (listener !== undefined) {
    search.on('DeviceAvailable', listener)
  }
  return search
}

module.exports = deviceDiscovery
