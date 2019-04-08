/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')
const Helpers = require('../helpers')

/**
 * Create a new instance of ZoneGroupTopology
 * @class ZoneGroupTopology
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 * Check http://[sonos_ip]:1400/xml/ZoneGroupTopology1.xml for all actions.
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
ZoneGroupTopology.prototype.GetZoneGroupAttributes = async function () { return this._request('GetZoneGroupAttributes', {}) }
/**
 * Get all the information about the ZoneGroups
 * @returns {Object} Object with one property, 'ZoneGroupState'
 */
ZoneGroupTopology.prototype.GetZoneGroupState = async function () { return this._request('GetZoneGroupState', {}) }
/**
 * Get all the ZoneGroups
 */
ZoneGroupTopology.prototype.AllZoneGroups = async function () {
  return this.GetZoneGroupState().then(async state => {
    let zoneGroupState = await Helpers.ParseXml(state.ZoneGroupState)
    if (zoneGroupState.ZoneGroupState) {
      zoneGroupState = zoneGroupState.ZoneGroupState
    }
    let groups = zoneGroupState.ZoneGroups.ZoneGroup
    for (let i = 0; i < groups.length; i++) {
      if (!Array.isArray(groups[i].ZoneGroupMember)) {
        groups[i].ZoneGroupMember = [groups[i].ZoneGroupMember]
      }
    }
    return groups
  })
}
module.exports = ZoneGroupTopology
