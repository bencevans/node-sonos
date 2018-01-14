/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of AudioIn
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

AudioIn.prototype.StartTransmissionToGroup = async function (options) { return this._request('StartTransmissionToGroup', options) }
AudioIn.prototype.StopTransmissionToGroup = async function (options) { return this._request('StopTransmissionToGroup', options) }
AudioIn.prototype.SetAudioInputAttributes = async function (options) { return this._request('SetAudioInputAttributes', options) }
AudioIn.prototype.GetAudioInputAttributes = async function (options) { return this._request('GetAudioInputAttributes', options) }
AudioIn.prototype.SetLineInLevel = async function (options) { return this._request('SetLineInLevel', options) }
AudioIn.prototype.GetLineInLevel = async function (options) { return this._request('GetLineInLevel', options) }
AudioIn.prototype.SelectAudio = async function (options) { return this._request('SelectAudio', options) }

module.exports = AudioIn
