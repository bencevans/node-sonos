const Service = require('./Service')
/**
 * Sonos ConnectionManagerService
 *
 * Services related to connections and protocols
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class ConnectionManagerService
 * @extends {Service}
 */
class ConnectionManagerService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'ConnectionManager'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/ConnectionManager/Control'
    this.eventSubURL = '/MediaRenderer/ConnectionManager/Event'
    this.SCPDURL = '/xml/ConnectionManager1.xml'
  }

  // #region actions
  /**
   * GetCurrentConnectionIDs
   * @returns {Promise<Object>} response object, with these properties `ConnectionIDs`
   */
  async GetCurrentConnectionIDs () { return this._request('GetCurrentConnectionIDs') }

  /**
   * GetCurrentConnectionInfo
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.ConnectionID
   * @returns {Promise<Object>} response object, with these properties `RcsID`, `AVTransportID`, `ProtocolInfo`, `PeerConnectionManager`, `PeerConnectionID`, `Direction`, `Status`
   */
  async GetCurrentConnectionInfo (options) { return this._request('GetCurrentConnectionInfo', options) }

  /**
   * GetProtocolInfo
   * @returns {Promise<Object>} response object, with these properties `Source`, `Sink`
   */
  async GetProtocolInfo () { return this._request('GetProtocolInfo') }
  // #endregion
}

module.exports = ConnectionManagerService
