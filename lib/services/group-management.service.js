const Service = require('./Service')
/**
 * Sonos GroupManagementService
 *
 * Services related to groups
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class GroupManagementService
 * @extends {Service}
 */
class GroupManagementService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'GroupManagement'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/GroupManagement/Control'
    this.eventSubURL = '/GroupManagement/Event'
    this.SCPDURL = '/xml/GroupManagement1.xml'
  }

  // #region actions
  /**
   * AddMember
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.MemberID
   * @param {number} options.BootSeq
   * @returns {Promise<Object>} response object, with these properties `CurrentTransportSettings`, `CurrentURI`, `GroupUUIDJoined`, `ResetVolumeAfter`, `VolumeAVTransportURI`
   */
  async AddMember (options) { return this._request('AddMember', options) }

  /**
   * RemoveMember
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.MemberID
   * @returns {Promise<Boolean>} request succeeded
   */
  async RemoveMember (options) { return this._request('RemoveMember', options) }

  /**
   * ReportTrackBufferingResult
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.MemberID
   * @param {number} options.ResultCode
   * @returns {Promise<Boolean>} request succeeded
   */
  async ReportTrackBufferingResult (options) { return this._request('ReportTrackBufferingResult', options) }

  /**
   * SetSourceAreaIds
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredSourceAreaIds
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetSourceAreaIds (options) { return this._request('SetSourceAreaIds', options) }
  // #endregion
}

module.exports = GroupManagementService
