var RenderingControl = function (host, port) {
  this.name = 'RenderingControl'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MediaRenderer/RenderingControl/Control'
  this.eventSubURL = '/MediaRenderer/RenderingControl/Event'
  this.SCPDURL = '/xml/RenderingControl1.xml'
}

require('util').inherits(RenderingControl, require('./Service'))

RenderingControl.prototype.GetVolume = function (options, callback) { this._request('GetVolume', options, callback) }
RenderingControl.prototype.SetVolume = function (options, callback) { this._request('SetVolume', options, callback) }
RenderingControl.prototype.GetMute = function (options, callback) { this._request('GetMute', options, callback) }
RenderingControl.prototype.SetMute = function (options, callback) { this._request('SetMute', options, callback) }

module.exports = RenderingControl
