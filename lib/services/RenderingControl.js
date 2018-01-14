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

RenderingControl.prototype.GetVolume = async function (options) { return this._request('GetVolume', options) }
RenderingControl.prototype.SetVolume = async function (options) { return this._request('SetVolume', options) }
RenderingControl.prototype.GetMute = async function (options) { return this._request('GetMute', options) }
RenderingControl.prototype.SetMute = async function (options) { return this._request('SetMute', options) }

module.exports = RenderingControl
