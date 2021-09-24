const Service = require('./Service')
/**
 * Sonos AudioInService
 *
 * Control line in
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class AudioInService
 * @extends {Service}
 */
class AudioInService extends Service {
  constructor (host, port) {
    super()
    this.name = 'AudioIn'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/AudioIn/Control'
    this.eventSubURL = '/AudioIn/Event'
    this.SCPDURL = '/xml/AudioIn1.xml'
  }

  // #region actions
  /**
   * GetAudioInputAttributes
   * @returns {Object} response object, with these properties 'CurrentName', 'CurrentIcon'
   */
  async GetAudioInputAttributes () { return this._request('GetAudioInputAttributes') }

  /**
   * GetLineInLevel
   * @returns {Object} response object, with these properties 'CurrentLeftLineInLevel', 'CurrentRightLineInLevel'
   */
  async GetLineInLevel () { return this._request('GetLineInLevel') }

  /**
   * SelectAudio
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID
   */
  async SelectAudio (options) { return this._request('SelectAudio', options) }

  /**
   * SetAudioInputAttributes
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredName
   * @param {string} options.DesiredIcon
   */
  async SetAudioInputAttributes (options) { return this._request('SetAudioInputAttributes', options) }

  /**
   * SetLineInLevel
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.DesiredLeftLineInLevel
   * @param {number} options.DesiredRightLineInLevel
   */
  async SetLineInLevel (options) { return this._request('SetLineInLevel', options) }

  /**
   * StartTransmissionToGroup
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.CoordinatorID
   * @returns {Object} response object, with these properties 'CurrentTransportSettings'
   */
  async StartTransmissionToGroup (options) { return this._request('StartTransmissionToGroup', options) }

  /**
   * StopTransmissionToGroup
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.CoordinatorID
   */
  async StopTransmissionToGroup (options) { return this._request('StopTransmissionToGroup', options) }
  // #endregion
}

module.exports = AudioInService
