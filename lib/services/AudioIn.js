/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of AudioIn
 * @class AudioIn
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class AudioIn extends Service {
  constructor (host, port) {
    super()
    this.name = 'AudioIn'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/AudioIn/Control'
    this.eventSubURL = '/AudioIn/Event'
    this.SCPDURL = '/xml/AudioIn1.xml'
  }

  async StartTransmissionToGroup (options) { return this._request('StartTransmissionToGroup', options) }

  async StopTransmissionToGroup (options) { return this._request('StopTransmissionToGroup', options) }

  async SetAudioInputAttributes (options) { return this._request('SetAudioInputAttributes', options) }

  async GetAudioInputAttributes (options) { return this._request('GetAudioInputAttributes', options) }

  async SetLineInLevel (options) { return this._request('SetLineInLevel', options) }

  async GetLineInLevel (options) { return this._request('GetLineInLevel', options) }

  async SelectAudio (options) { return this._request('SelectAudio', options) }
}

module.exports = AudioIn
