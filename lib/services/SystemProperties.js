/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of SystemProperties
 * @class SystemProperties
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var SystemProperties = function (host, port) {
  this.name = 'SystemProperties'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/SystemProperties/Control'
  this.eventSubURL = '/SystemProperties/Event'
  this.SCPDURL = '/xml/SystemProperties1.xml'
}

util.inherits(SystemProperties, Service)

SystemProperties.prototype.SetString = async function (options) { return this._request('SetString', options) }
SystemProperties.prototype.SetStringX = async function (options) { return this._request('SetStringX', options) }
SystemProperties.prototype.GetString = async function (options) { return this._request('GetString', options) }
SystemProperties.prototype.GetStringX = async function (options) { return this._request('GetStringX', options) }
SystemProperties.prototype.Remove = async function (options) { return this._request('Remove', options) }
SystemProperties.prototype.RemoveX = async function (options) { return this._request('RemoveX', options) }
SystemProperties.prototype.GetWebCode = async function (options) { return this._request('GetWebCode', options) }
SystemProperties.prototype.ProvisionTrialAccount = async function (options) { return this._request('ProvisionTrialAccount', options) }
SystemProperties.prototype.ProvisionCredentialedTrialAccountX = async function (options) { return this._request('ProvisionCredentialedTrialAccountX', options) }
SystemProperties.prototype.MigrateTrialAccountX = async function (options) { return this._request('MigrateTrialAccountX', options) }
SystemProperties.prototype.AddAccountX = async function (options) { return this._request('AddAccountX', options) }
SystemProperties.prototype.AddAccountWithCredentialsX = async function (options) { return this._request('AddAccountWithCredentialsX', options) }
SystemProperties.prototype.RemoveAccount = async function (options) { return this._request('RemoveAccount', options) }
SystemProperties.prototype.EditAccountPasswordX = async function (options) { return this._request('EditAccountPasswordX', options) }
SystemProperties.prototype.EditAccountMd = async function (options) { return this._request('EditAccountMd', options) }
SystemProperties.prototype.DoPostUpdateTasks = async function (options) { return this._request('DoPostUpdateTasks', options) }
SystemProperties.prototype.ResetThirdPartyCredentials = async function (options) { return this._request('ResetThirdPartyCredentials', options) }

module.exports = SystemProperties
