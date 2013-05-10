
var SystemProperties = function(host, port) {
  this.name = 'SystemProperties';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/SystemProperties/Control';
  this.eventSubURL = '/MediaRenderer/SystemProperties/Event';
  this.SCPDURL = '/xml/SystemProperties1.xml';
};

require('util').inherits(SystemProperties, require('./Service'));

SystemProperties.prototype.SetString = function(options, callback) { this._request('SetString', options, callback); };
SystemProperties.prototype.SetStringX = function(options, callback) { this._request('SetStringX', options, callback); };
SystemProperties.prototype.GetString = function(options, callback) { this._request('GetString', options, callback); };
SystemProperties.prototype.GetStringX = function(options, callback) { this._request('GetStringX', options, callback); };
SystemProperties.prototype.Remove = function(options, callback) { this._request('Remove', options, callback); };
SystemProperties.prototype.RemoveX = function(options, callback) { this._request('RemoveX', options, callback); };
SystemProperties.prototype.GetWebCode = function(options, callback) { this._request('GetWebCode', options, callback); };
SystemProperties.prototype.ProvisionTrialAccount = function(options, callback) { this._request('ProvisionTrialAccount', options, callback); };
SystemProperties.prototype.ProvisionCredentialedTrialAccountX = function(options, callback) { this._request('ProvisionCredentialedTrialAccountX', options, callback); };
SystemProperties.prototype.MigrateTrialAccountX = function(options, callback) { this._request('MigrateTrialAccountX', options, callback); };
SystemProperties.prototype.AddAccountX = function(options, callback) { this._request('AddAccountX', options, callback); };
SystemProperties.prototype.AddAccountWithCredentialsX = function(options, callback) { this._request('AddAccountWithCredentialsX', options, callback); };
SystemProperties.prototype.RemoveAccount = function(options, callback) { this._request('RemoveAccount', options, callback); };
SystemProperties.prototype.EditAccountPasswordX = function(options, callback) { this._request('EditAccountPasswordX', options, callback); };
SystemProperties.prototype.EditAccountMd = function(options, callback) { this._request('EditAccountMd', options, callback); };
SystemProperties.prototype.DoPostUpdateTasks = function(options, callback) { this._request('DoPostUpdateTasks', options, callback); };
SystemProperties.prototype.ResetThirdPartyCredentials = function(options, callback) { this._request('ResetThirdPartyCredentials', options, callback); };

module.exports = SystemProperties;