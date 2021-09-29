const Service = require('./Service')
/**
 * Sonos QPlayService
 *
 * Services related to Chinese Tencent Qplay service
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class QPlayService
 * @extends {Service}
 */
class QPlayService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'QPlay'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/QPlay/Control'
    this.eventSubURL = '/QPlay/Event'
    this.SCPDURL = '/xml/QPlay1.xml'
  }

  // #region actions
  /**
   * QPlayAuth
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Seed
   * @returns {Promise<Object>} response object, with these properties `Code`, `MID`, `DID`
   */
  async QPlayAuth (options) { return this._request('QPlayAuth', options) }
  // #endregion
}

module.exports = QPlayService
