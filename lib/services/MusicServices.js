var MusicServices = function (host, port) {
  this.name = 'MusicServices'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MusicServices/Control'
  this.eventSubURL = '/MusicServices/Event'
  this.SCPDURL = '/xml/MusicServices1.xml'
}

require('util').inherits(MusicServices, require('./Service'))

MusicServices.prototype.GetSessionId = function (options, callback) { this._request('GetSessionId', options, callback) }
MusicServices.prototype.ListAvailableServices = function (options, callback) { this._request('ListAvailableServices', options, callback) }
MusicServices.prototype.UpdateAvailableServices = function (options, callback) { this._request('UpdateAvailableServices', options, callback) }

module.exports = MusicServices
