/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of MusicServices
 * @class MusicServices
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var MusicServices = function (host, port) {
  this.name = 'MusicServices'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MusicServices/Control'
  this.eventSubURL = '/MusicServices/Event'
  this.SCPDURL = '/xml/MusicServices1.xml'
}

util.inherits(MusicServices, Service)

MusicServices.prototype.GetSessionId = function (options, callback) { this._request('GetSessionId', options, callback) }
MusicServices.prototype.ListAvailableServices = function (options, callback) { this._request('ListAvailableServices', options, callback) }
MusicServices.prototype.UpdateAvailableServices = function (options, callback) { this._request('UpdateAvailableServices', options, callback) }

module.exports = MusicServices
