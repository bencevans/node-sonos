const Service = require('./Service')
/**
 * Sonos HTControlService
 *
 * Service related to the TV remote control
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class HTControlService
 * @extends {Service}
 */
class HTControlService extends Service {
  constructor (host, port) {
    super()
    this.name = 'HTControl'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/HTControl/Control'
    this.eventSubURL = '/HTControl/Event'
    this.SCPDURL = '/xml/HTControl1.xml'
  }

  // #region actions
  /**
   * CommitLearnedIRCodes
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Name
   */
  async CommitLearnedIRCodes (options) { return this._request('CommitLearnedIRCodes', options) }

  /**
   * GetIRRepeaterState
   * @returns {Object} response object, with these properties 'CurrentIRRepeaterState'
   */
  async GetIRRepeaterState () { return this._request('GetIRRepeaterState') }

  /**
   * GetLEDFeedbackState
   * @returns {Object} response object, with these properties 'LEDFeedbackState'
   */
  async GetLEDFeedbackState () { return this._request('GetLEDFeedbackState') }

  /**
   * IdentifyIRRemote
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.Timeout
   */
  async IdentifyIRRemote (options) { return this._request('IdentifyIRRemote', options) }

  /**
   * IsRemoteConfigured
   * @returns {Object} response object, with these properties 'RemoteConfigured'
   */
  async IsRemoteConfigured () { return this._request('IsRemoteConfigured') }

  /**
   * LearnIRCode
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.IRCode
   * @param {number} options.Timeout
   */
  async LearnIRCode (options) { return this._request('LearnIRCode', options) }

  /**
   * SetIRRepeaterState
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredIRRepeaterState [ 'On' / 'Off' / 'Disabled' ]
   */
  async SetIRRepeaterState (options) { return this._request('SetIRRepeaterState', options) }

  /**
   * SetLEDFeedbackState
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.LEDFeedbackState [ 'On' / 'Off' ]
   */
  async SetLEDFeedbackState (options) { return this._request('SetLEDFeedbackState', options) }
  // #endregion
}

module.exports = HTControlService
