/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of ZoneGroupTopology
 * @class ZoneGroupTopology
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var ZoneGroupTopology = function (host, port) {
  this.name = 'ZoneGroupTopology'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/ZoneGroupTopology/Control'
  this.eventSubURL = '/ZoneGroupTopology/Event'
  this.SCPDURL = '/xml/ZoneGroupTopology1.xml'
}

util.inherits(ZoneGroupTopology, Service)

ZoneGroupTopology.prototype.CheckForUpdate = async function (options) { return this._request('CheckForUpdate', options) }
ZoneGroupTopology.prototype.BeginSoftwareUpdate = async function (options) { return this._request('BeginSoftwareUpdate', options) }
ZoneGroupTopology.prototype.ReportUnresponsiveDevice = async function (options) { return this._request('ReportUnresponsiveDevice', options) }
ZoneGroupTopology.prototype.ReportAlarmStartedRunning = async function (options) { return this._request('ReportAlarmStartedRunning', options) }
ZoneGroupTopology.prototype.SubmitDiagnostics = async function (options) { return this._request('SubmitDiagnostics', options) }
ZoneGroupTopology.prototype.RegisterMobileDevice = async function (options) { return this._request('RegisterMobileDevice', options) }
ZoneGroupTopology.prototype.GetZoneGroupAttributes = async function (options) { return this._request('GetZoneGroupAttributes', options) }

module.exports = ZoneGroupTopology
