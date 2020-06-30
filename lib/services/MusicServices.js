/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of MusicServices
 * @class MusicServices
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class MusicServices extends Service {
  constructor (host, port) {
    super()
    this.name = 'MusicServices'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MusicServices/Control'
    this.eventSubURL = '/MusicServices/Event'
    this.SCPDURL = '/xml/MusicServices1.xml'
  }

  async GetSessionId (options) { return this._request('GetSessionId', options) }

  async ListAvailableServices (options) { return this._request('ListAvailableServices', options) }

  async UpdateAvailableServices (options) { return this._request('UpdateAvailableServices', options) }
}

module.exports = MusicServices
