const Service = require('./Service')
/**
 * Sonos VirtualLineInService
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class VirtualLineInService
 * @extends {Service}
 */
class VirtualLineInService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'VirtualLineIn'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/VirtualLineIn/Control'
    this.eventSubURL = '/MediaRenderer/VirtualLineIn/Event'
    this.SCPDURL = '/xml/VirtualLineIn1.xml'
  }

  // #region actions
  /**
   * Next
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @returns {Promise<Boolean>} request succeeded
   */
  async Next (options = { InstanceID: 0 }) { return this._request('Next', options) }

  /**
   * Pause
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @returns {Promise<Boolean>} request succeeded
   */
  async Pause (options = { InstanceID: 0 }) { return this._request('Pause', options) }

  /**
   * Play
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @param {string} options.Speed
   * @returns {Promise<Boolean>} request succeeded
   */
  async Play (options) { return this._request('Play', options) }

  /**
   * Previous
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @returns {Promise<Boolean>} request succeeded
   */
  async Previous (options = { InstanceID: 0 }) { return this._request('Previous', options) }

  /**
   * SetVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @param {number} options.DesiredVolume
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetVolume (options) { return this._request('SetVolume', options) }

  /**
   * StartTransmission
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @param {string} options.CoordinatorID
   * @returns {Promise<{ CurrentTransportSettings: string}>} response object.
   */
  async StartTransmission (options) { return this._request('StartTransmission', options) }

  /**
   * Stop
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @returns {Promise<Boolean>} request succeeded
   */
  async Stop (options = { InstanceID: 0 }) { return this._request('Stop', options) }

  /**
   * StopTransmission
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID
   * @param {string} options.CoordinatorID
   * @returns {Promise<Boolean>} request succeeded
   */
  async StopTransmission (options) { return this._request('StopTransmission', options) }
  // #endregion
}

module.exports = VirtualLineInService
