const Service = require('./Service')
/**
 * Sonos GroupRenderingControlService
 *
 * Volume related controls for groups
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class GroupRenderingControlService
 * @extends {Service}
 */
class GroupRenderingControlService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'GroupRenderingControl'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/GroupRenderingControl/Control'
    this.eventSubURL = '/MediaRenderer/GroupRenderingControl/Event'
    this.SCPDURL = '/xml/GroupRenderingControl1.xml'
  }

  // #region actions
  /**
   * GetGroupMute - Get the group mute state.
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   * @returns {Promise<Object>} response object, with these properties `CurrentMute`
   */
  async GetGroupMute (options = { InstanceID: 0 }) { return this._request('GetGroupMute', options) }

  /**
   * GetGroupVolume - Get the group volume.
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   * @returns {Promise<Object>} response object, with these properties `CurrentVolume`
   */
  async GetGroupVolume (options = { InstanceID: 0 }) { return this._request('GetGroupVolume', options) }

  /**
   * SetGroupMute - (Un-/)Mute the entire group
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {boolean} options.DesiredMute
   * @remarks Should be send to coordinator only
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetGroupMute (options) { return this._request('SetGroupMute', options) }

  /**
   * SetGroupVolume - Change group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.DesiredVolume - New volume between 0 and 100
   * @remarks Should be send to coordinator only
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetGroupVolume (options) { return this._request('SetGroupVolume', options) }

  /**
   * SetRelativeGroupVolume - Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.Adjustment - Number between -100 and +100
   * @remarks Should be send to coordinator only
   * @returns {Promise<Object>} response object, with these properties `NewVolume`
   */
  async SetRelativeGroupVolume (options) { return this._request('SetRelativeGroupVolume', options) }

  /**
   * SnapshotGroupVolume - Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @remarks Should be send to coordinator only
   * @returns {Promise<Boolean>} request succeeded
   */
  async SnapshotGroupVolume (options = { InstanceID: 0 }) { return this._request('SnapshotGroupVolume', options) }
  // #endregion
}

module.exports = GroupRenderingControlService
