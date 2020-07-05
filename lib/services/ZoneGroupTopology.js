/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')
const Helpers = require('../helpers')

/**
 * Create a new instance of ZoneGroupTopology
 * @class ZoneGroupTopology
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 * Check http://[sonos_ip]:1400/xml/ZoneGroupTopology1.xml for all actions.
 */
class ZoneGroupTopology extends Service {
  constructor (host, port) {
    super()
    this.name = 'ZoneGroupTopology'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/ZoneGroupTopology/Control'
    this.eventSubURL = '/ZoneGroupTopology/Event'
    this.SCPDURL = '/xml/ZoneGroupTopology1.xml'
  }

  async CheckForUpdate (options) { return this._request('CheckForUpdate', options) }

  async BeginSoftwareUpdate (options) { return this._request('BeginSoftwareUpdate', options) }

  async ReportUnresponsiveDevice (options) { return this._request('ReportUnresponsiveDevice', options) }

  async ReportAlarmStartedRunning (options) { return this._request('ReportAlarmStartedRunning', options) }

  async SubmitDiagnostics (options) { return this._request('SubmitDiagnostics', options) }

  async RegisterMobileDevice (options) { return this._request('RegisterMobileDevice', options) }

  async GetZoneGroupAttributes () { return this._request('GetZoneGroupAttributes', {}) }

  /**
   * Get all the information about the ZoneGroups
   * @returns {Object} Object with one property, 'ZoneGroupState'
   */
  async GetZoneGroupState () { return this._request('GetZoneGroupState', {}) }

  /**
   * Get all the ZoneGroups
   */
  async AllZoneGroups () {
    return this.GetZoneGroupState().then(async state => {
      let zoneGroupState = await Helpers.ParseXml(state.ZoneGroupState)
      if (zoneGroupState.ZoneGroupState) {
        zoneGroupState = zoneGroupState.ZoneGroupState
      }
      let groups = zoneGroupState.ZoneGroups.ZoneGroup
      if (!Array.isArray(groups)) {
        groups = [groups]
      }
      for (let i = 0; i < groups.length; i++) {
        if (!Array.isArray(groups[i].ZoneGroupMember)) {
          groups[i].ZoneGroupMember = [groups[i].ZoneGroupMember]
        }
      }
      return groups
    })
  }
}

module.exports = ZoneGroupTopology
