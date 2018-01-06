/**
  * A service to modify everything related to AudioIn
  * @module AudioIn
  * @requires './Service'
  */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of AlarmClock
 * @class AudioIn
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var AudioIn = function (host, port) {
  this.name = 'AudioIn'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/AudioIn/Control'
  this.eventSubURL = '/AudioIn/Event'
  this.SCPDURL = '/xml/AudioIn1.xml'
}

util.inherits(AudioIn, Service)

AudioIn.prototype.StartTransmissionToGroup = function (options, callback) { this._request('StartTransmissionToGroup', options, callback) }
AudioIn.prototype.StopTransmissionToGroup = function (options, callback) { this._request('StopTransmissionToGroup', options, callback) }
AudioIn.prototype.SetAudioInputAttributes = function (options, callback) { this._request('SetAudioInputAttributes', options, callback) }
AudioIn.prototype.GetAudioInputAttributes = function (options, callback) { this._request('GetAudioInputAttributes', options, callback) }
AudioIn.prototype.SetLineInLevel = function (options, callback) { this._request('SetLineInLevel', options, callback) }
AudioIn.prototype.GetLineInLevel = function (options, callback) { this._request('GetLineInLevel', options, callback) }
AudioIn.prototype.SelectAudio = function (options, callback) { this._request('SelectAudio', options, callback) }

module.exports = AudioIn
