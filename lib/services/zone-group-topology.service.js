const Service = require('./Service')
/**
 * Sonos ZoneGroupTopologyService
 *
 * Zone config stuff, eg getting all the configured sonos zones
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class ZoneGroupTopologyService
 * @extends {Service}
 */
class ZoneGroupTopologyService extends Service {
  constructor (host, port) {
    super()
    this.name = 'ZoneGroupTopology'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/ZoneGroupTopology/Control'
    this.eventSubURL = '/ZoneGroupTopology/Event'
    this.SCPDURL = '/xml/ZoneGroupTopology1.xml'
  }

  // #region actions
  /**
   * BeginSoftwareUpdate
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.UpdateURL
   * @param {number} options.Flags
   * @param {string} options.ExtraOptions
   */
  async BeginSoftwareUpdate (options) { return this._request('BeginSoftwareUpdate', options) }

  /**
   * CheckForUpdate
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.UpdateType [ 'All' / 'Software' ]
   * @param {boolean} options.CachedOnly
   * @param {string} options.Version
   * @returns {Object} response object, with these properties 'UpdateItem'
   */
  async CheckForUpdate (options) { return this._request('CheckForUpdate', options) }

  /**
   * GetZoneGroupAttributes - Get information about the current Zone
   * @returns {Object} response object, with these properties 'CurrentZoneGroupName', 'CurrentZoneGroupID', 'CurrentZonePlayerUUIDsInGroup', 'CurrentMuseHouseholdId'
   */
  async GetZoneGroupAttributes () { return this._request('GetZoneGroupAttributes') }

  /**
   * GetZoneGroupState - Get all the Sonos groups, (as XML)
   * @remarks Some libraries also support GetParsedZoneGroupState that parses the xml for you.
   * @returns {Object} response object, with these properties 'ZoneGroupState'
   */
  async GetZoneGroupState () { return this._request('GetZoneGroupState') }

  /**
   * RegisterMobileDevice
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.MobileDeviceName
   * @param {string} options.MobileDeviceUDN
   * @param {string} options.MobileIPAndPort
   */
  async RegisterMobileDevice (options) { return this._request('RegisterMobileDevice', options) }

  /**
   * ReportAlarmStartedRunning
   */
  async ReportAlarmStartedRunning () { return this._request('ReportAlarmStartedRunning') }

  /**
   * ReportUnresponsiveDevice
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DeviceUUID
   * @param {string} options.DesiredAction [ 'Remove' / 'TopologyMonitorProbe' / 'VerifyThenRemoveSystemwide' ]
   */
  async ReportUnresponsiveDevice (options) { return this._request('ReportUnresponsiveDevice', options) }

  /**
   * SubmitDiagnostics
   *
   * @param {Object} [options] - An object with the following properties
   * @param {boolean} options.IncludeControllers
   * @param {string} options.Type
   * @returns {Object} response object, with these properties 'DiagnosticID'
   */
  async SubmitDiagnostics (options) { return this._request('SubmitDiagnostics', options) }
  // #endregion
}

module.exports = ZoneGroupTopologyService
