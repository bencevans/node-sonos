/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of RenderingControl
 * @class RenderingControl
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var RenderingControl = function (host, port) {
  this.name = 'RenderingControl'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MediaRenderer/RenderingControl/Control'
  this.eventSubURL = '/MediaRenderer/RenderingControl/Event'
  this.SCPDURL = '/xml/RenderingControl1.xml'
}

util.inherits(RenderingControl, Service)

RenderingControl.prototype.GetVolume = function (options, callback) { this._request('GetVolume', options, callback) }
RenderingControl.prototype.SetVolume = function (options, callback) { this._request('SetVolume', options, callback) }
RenderingControl.prototype.GetMute = function (options, callback) { this._request('GetMute', options, callback) }
RenderingControl.prototype.SetMute = function (options, callback) { this._request('SetMute', options, callback) }

module.exports = RenderingControl
