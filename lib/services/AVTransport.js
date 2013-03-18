
var AVTransport = function(host, port) {
  this.name = 'AVTransport';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/AVTransport/Control';
  this.eventSubURL = '/MediaRenderer/AVTransport/Event';
  this.SCPDURL = '/xml/AVTransport1.xml';
};

require('util').inherits(AVTransport, require('./Service'));

AVTransport.prototype.SetAVTransportURI = function(options, callback) { this._request('SetAVTransportURI', options, callback); };
AVTransport.prototype.AddURIToQueue = function(options, callback) { this._request('AddURIToQueue', options, callback); };
AVTransport.prototype.AddMultipleURIsToQueue = function(options, callback) { this._request('AddMultipleURIsToQueue', options, callback); };
AVTransport.prototype.ReorderTracksInQueue = function(options, callback) { this._request('ReorderTracksInQueue', options, callback); };
AVTransport.prototype.RemoveTrackFromQueue = function(options, callback) { this._request('RemoveTrackFromQueue', options, callback); };
AVTransport.prototype.RemoveTrackRangeFromQueue = function(options, callback) { this._request('RemoveTrackRangeFromQueue', options, callback); };
AVTransport.prototype.RemoveAllTracksFromQueue = function(options, callback) { this._request('RemoveAllTracksFromQueue', options, callback); };
AVTransport.prototype.SaveQueue = function(options, callback) { this._request('SaveQueue', options, callback); };
AVTransport.prototype.BackupQueue = function(options, callback) { this._request('BackupQueue', options, callback); };
AVTransport.prototype.GetMediaInfo = function(options, callback) { this._request('GetMediaInfo', options, callback); };
AVTransport.prototype.GetTransportInfo = function(options, callback) { this._request('GetTransportInfo', options, callback); };
AVTransport.prototype.GetPositionInfo = function(options, callback) { this._request('GetPositionInfo', options, callback); };
AVTransport.prototype.GetDeviceCapabilities = function(options, callback) { this._request('GetDeviceCapabilities', options, callback); };
AVTransport.prototype.GetTransportSettings = function(options, callback) { this._request('GetTransportSettings', options, callback); };
AVTransport.prototype.GetCrossfadeMode = function(options, callback) { this._request('GetCrossfadeMode', options, callback); };
AVTransport.prototype.Stop = function(options, callback) { this._request('Stop', options, callback); };
AVTransport.prototype.Play = function(options, callback) { this._request('Play', options, callback); };
AVTransport.prototype.Pause = function(options, callback) { this._request('Pause', options, callback); };
AVTransport.prototype.Seek = function(options, callback) { this._request('Seek', options, callback); };
AVTransport.prototype.Next = function(options, callback) { this._request('Next', options, callback); };
AVTransport.prototype.NextProgrammedRadioTracks = function(options, callback) { this._request('NextProgrammedRadioTracks', options, callback); };
AVTransport.prototype.Previous = function(options, callback) { this._request('Previous', options, callback); };
AVTransport.prototype.NextSection = function(options, callback) { this._request('NextSection', options, callback); };
AVTransport.prototype.PreviousSection = function(options, callback) { this._request('PreviousSection', options, callback); };
AVTransport.prototype.SetPlayMode = function(options, callback) { this._request('SetPlayMode', options, callback); };
AVTransport.prototype.SetCrossfadeMode = function(options, callback) { this._request('SetCrossfadeMode', options, callback); };
AVTransport.prototype.NotifyDeletedURI = function(options, callback) { this._request('NotifyDeletedURI', options, callback); };
AVTransport.prototype.GetCurrentTransportActions = function(options, callback) { this._request('GetCurrentTransportActions', options, callback); };
AVTransport.prototype.BecomeCoordinatorOfStandaloneGroup = function(options, callback) { this._request('BecomeCoordinatorOfStandaloneGroup', options, callback); };
AVTransport.prototype.DelegateGroupCoordinationTo = function(options, callback) { this._request('DelegateGroupCoordinationTo', options, callback); };
AVTransport.prototype.BecomeGroupCoordinator = function(options, callback) { this._request('BecomeGroupCoordinator', options, callback); };
AVTransport.prototype.BecomeGroupCoordinatorAndSource = function(options, callback) { this._request('BecomeGroupCoordinatorAndSource', options, callback); };

module.exports = AVTransport;
