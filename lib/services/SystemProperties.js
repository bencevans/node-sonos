/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of SystemProperties
 * @class SystemProperties
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class SystemProperties extends Service {
  constructor (host, port) {
    super()
    this.name = 'SystemProperties'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/SystemProperties/Control'
    this.eventSubURL = '/SystemProperties/Event'
    this.SCPDURL = '/xml/SystemProperties1.xml'
  }

  async SetString (options) { return this._request('SetString', options) }

  async SetStringX (options) { return this._request('SetStringX', options) }

  async GetString (options) { return this._request('GetString', options) }

  async GetStringX (options) { return this._request('GetStringX', options) }

  async Remove (options) { return this._request('Remove', options) }

  async RemoveX (options) { return this._request('RemoveX', options) }

  async GetWebCode (options) { return this._request('GetWebCode', options) }

  async ProvisionTrialAccount (options) { return this._request('ProvisionTrialAccount', options) }

  async ProvisionCredentialedTrialAccountX (options) { return this._request('ProvisionCredentialedTrialAccountX', options) }

  async MigrateTrialAccountX (options) { return this._request('MigrateTrialAccountX', options) }

  async AddAccountX (options) { return this._request('AddAccountX', options) }

  async AddAccountWithCredentialsX (options) { return this._request('AddAccountWithCredentialsX', options) }

  async RemoveAccount (options) { return this._request('RemoveAccount', options) }

  async EditAccountPasswordX (options) { return this._request('EditAccountPasswordX', options) }

  async EditAccountMd (options) { return this._request('EditAccountMd', options) }

  async DoPostUpdateTasks (options) { return this._request('DoPostUpdateTasks', options) }

  async ResetThirdPartyCredentials (options) { return this._request('ResetThirdPartyCredentials', options) }
}

module.exports = SystemProperties
