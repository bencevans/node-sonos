/**
 * A service to modify everything related to SystemProperties
 * @module SystemProperties
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

SystemProperties.prototype.SetString = function (options, callback) { this._request('SetString', options, callback) }
SystemProperties.prototype.SetStringX = function (options, callback) { this._request('SetStringX', options, callback) }
SystemProperties.prototype.GetString = function (options, callback) { this._request('GetString', options, callback) }
SystemProperties.prototype.GetStringX = function (options, callback) { this._request('GetStringX', options, callback) }
SystemProperties.prototype.Remove = function (options, callback) { this._request('Remove', options, callback) }
SystemProperties.prototype.RemoveX = function (options, callback) { this._request('RemoveX', options, callback) }
SystemProperties.prototype.GetWebCode = function (options, callback) { this._request('GetWebCode', options, callback) }
SystemProperties.prototype.ProvisionTrialAccount = function (options, callback) { this._request('ProvisionTrialAccount', options, callback) }
SystemProperties.prototype.ProvisionCredentialedTrialAccountX = function (options, callback) { this._request('ProvisionCredentialedTrialAccountX', options, callback) }
SystemProperties.prototype.MigrateTrialAccountX = function (options, callback) { this._request('MigrateTrialAccountX', options, callback) }
SystemProperties.prototype.AddAccountX = function (options, callback) { this._request('AddAccountX', options, callback) }
SystemProperties.prototype.AddAccountWithCredentialsX = function (options, callback) { this._request('AddAccountWithCredentialsX', options, callback) }
SystemProperties.prototype.RemoveAccount = function (options, callback) { this._request('RemoveAccount', options, callback) }
SystemProperties.prototype.EditAccountPasswordX = function (options, callback) { this._request('EditAccountPasswordX', options, callback) }
SystemProperties.prototype.EditAccountMd = function (options, callback) { this._request('EditAccountMd', options, callback) }
SystemProperties.prototype.DoPostUpdateTasks = function (options, callback) { this._request('DoPostUpdateTasks', options, callback) }
SystemProperties.prototype.ResetThirdPartyCredentials = function (options, callback) { this._request('ResetThirdPartyCredentials', options, callback) }

module.exports = SystemProperties
