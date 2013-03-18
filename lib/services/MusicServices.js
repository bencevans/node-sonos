
var MusicServices = function(host, port) {
  this.name = 'MusicServices';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/MusicServices/Control';
  this.eventSubURL = '/MediaRenderer/MusicServices/Event';
  this.SCPDURL = '/xml/MusicServices1.xml';
};

require('util').inherits(MusicServices, require('./Service'));

AVTransport.prototype.GetSessionId = function(options, callback) { this._request('GetSessionId', options, callback); };
AVTransport.prototype.ListAvailableServices = function(options, callback) { this._request('ListAvailableServices', options, callback); };
AVTransport.prototype.UpdateAvailableServices = function(options, callback) { this._request('UpdateAvailableServices', options, callback); };

module.exports = MusicServices;