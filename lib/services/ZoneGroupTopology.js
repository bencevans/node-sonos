
var ZoneGroupTopology = function(host, port) {
  this.name = 'ZoneGroupTopology';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/ZoneGroupTopology/Control';
  this.eventSubURL = '/MediaRenderer/ZoneGroupTopology/Event';
  this.SCPDURL = '/xml/ZoneGroupTopology1.xml';
};

require('util').inherits(ZoneGroupTopology, require('./Service'));

ZoneGroupTopology.prototype.CheckForUpdate = function(options, callback) { this._request('CheckForUpdate', options, callback); };
ZoneGroupTopology.prototype.BeginSoftwareUpdate = function(options, callback) { this._request('BeginSoftwareUpdate', options, callback); };
ZoneGroupTopology.prototype.ReportUnresponsiveDevice = function(options, callback) { this._request('ReportUnresponsiveDevice', options, callback); };
ZoneGroupTopology.prototype.ReportAlarmStartedRunning = function(options, callback) { this._request('ReportAlarmStartedRunning', options, callback); };
ZoneGroupTopology.prototype.SubmitDiagnostics = function(options, callback) { this._request('SubmitDiagnostics', options, callback); };
ZoneGroupTopology.prototype.RegisterMobileDevice = function(options, callback) { this._request('RegisterMobileDevice', options, callback); };
ZoneGroupTopology.prototype.GetZoneGroupAttributes = function(options, callback) { this._request('GetZoneGroupAttributes', options, callback); };

module.exports = ZoneGroupTopology;