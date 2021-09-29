const Service = require('./Service')
/**
 * Sonos MusicServicesService
 *
 * Access to external music services, like Spotify or Youtube Music
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class MusicServicesService
 * @extends {Service}
 */
class MusicServicesService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'MusicServices'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MusicServices/Control'
    this.eventSubURL = '/MusicServices/Event'
    this.SCPDURL = '/xml/MusicServices1.xml'
  }

  // #region actions
  /**
   * GetSessionId
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.ServiceId
   * @param {string} options.Username
   * @returns {Promise<Object>} response object, with these properties `SessionId`
   */
  async GetSessionId (options) { return this._request('GetSessionId', options) }

  /**
   * ListAvailableServices - Load music service list as xml
   * @remarks Some libraries also support ListAndParseAvailableServices
   * @returns {Promise<Object>} response object, with these properties `AvailableServiceDescriptorList`, `AvailableServiceTypeList`, `AvailableServiceListVersion`
   */
  async ListAvailableServices () { return this._request('ListAvailableServices') }

  /**
   * UpdateAvailableServices
   * @returns {Promise<Boolean>} request succeeded
   */
  async UpdateAvailableServices () { return this._request('UpdateAvailableServices') }
  // #endregion
}

module.exports = MusicServicesService
