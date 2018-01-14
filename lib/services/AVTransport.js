/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

  const util = require('util')
  const Service = require('./Service')

  /**
   * Create a new instance of AVTransport
   * @class AVTransport
   * @param {String} host The host param of one of your sonos speakers
   * @param {Number} port The port of your sonos speaker, defaults to 1400
   */

  var AVTransport = function (host, port) {
    this.name = 'AVTransport'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/AVTransport/Control'
    this.eventSubURL = '/MediaRenderer/AVTransport/Event'
    this.SCPDURL = '/xml/AVTransport1.xml'
  }

  util.inherits(AVTransport, Service)

  AVTransport.prototype.SetAVTransportURI = async function (options) { return this._request('SetAVTransportURI', options) }
  AVTransport.prototype.AddURIToQueue = async function (options) { return this._request('AddURIToQueue', options) }
  AVTransport.prototype.AddMultipleURIsToQueue = async function (options) { return this._request('AddMultipleURIsToQueue', options) }
  AVTransport.prototype.ReorderTracksInQueue = async function (options) { return this._request('ReorderTracksInQueue', options) }
  AVTransport.prototype.RemoveTrackFromQueue = async function (options) { return this._request('RemoveTrackFromQueue', options) }
  AVTransport.prototype.RemoveTrackRangeFromQueue = async function (options) { return this._request('RemoveTrackRangeFromQueue', options) }
  AVTransport.prototype.RemoveAllTracksFromQueue = async function (options) { return this._request('RemoveAllTracksFromQueue', options) }
  AVTransport.prototype.SaveQueue = async function (options) { return this._request('SaveQueue', options) }
  AVTransport.prototype.BackupQueue = async function (options) { return this._request('BackupQueue', options) }
  AVTransport.prototype.GetMediaInfo = async function (options) { return this._request('GetMediaInfo', options) }
  AVTransport.prototype.GetTransportInfo = async function (options) { return this._request('GetTransportInfo', options) }
  AVTransport.prototype.GetPositionInfo = async function (options) { return this._request('GetPositionInfo', options) }
  AVTransport.prototype.GetDeviceCapabilities = async function (options) { return this._request('GetDeviceCapabilities', options) }
  AVTransport.prototype.GetTransportSettings = async function (options) { return this._request('GetTransportSettings', options) }
  AVTransport.prototype.GetCrossfadeMode = async function (options) { return this._request('GetCrossfadeMode', options) }
  AVTransport.prototype.Stop = async function (options) { return this._request('Stop', options) }
  AVTransport.prototype.Play = async function (options) { return this._request('Play', options) }
  AVTransport.prototype.Pause = async function (options) { return this._request('Pause', options) }
  AVTransport.prototype.Seek = async function (options) { return this._request('Seek', options) }
  AVTransport.prototype.Next = async function (options) { return this._request('Next', options) }
  AVTransport.prototype.NextProgrammedRadioTracks = async function (options) { return this._request('NextProgrammedRadioTracks', options) }
  AVTransport.prototype.Previous = async function (options) { return this._request('Previous', options) }
  AVTransport.prototype.NextSection = async function (options) { return this._request('NextSection', options) }
  AVTransport.prototype.PreviousSection = async function (options) { return this._request('PreviousSection', options) }
  AVTransport.prototype.SetPlayMode = async function (options) { return this._request('SetPlayMode', options) }
  AVTransport.prototype.SetCrossfadeMode = async function (options) { return this._request('SetCrossfadeMode', options) }
  AVTransport.prototype.NotifyDeletedURI = async function (options) { return this._request('NotifyDeletedURI', options) }
  AVTransport.prototype.GetCurrentTransportActions = async function (options) { return this._request('GetCurrentTransportActions', options) }
  AVTransport.prototype.BecomeCoordinatorOfStandaloneGroup = async function (options) { return this._request('BecomeCoordinatorOfStandaloneGroup', options) }
  AVTransport.prototype.DelegateGroupCoordinationTo = async function (options) { return this._request('DelegateGroupCoordinationTo', options) }
  AVTransport.prototype.BecomeGroupCoordinator = async function (options) { return this._request('BecomeGroupCoordinator', options) }
  AVTransport.prototype.BecomeGroupCoordinatorAndSource = async function (options) { return this._request('BecomeGroupCoordinatorAndSource', options) }
  AVTransport.prototype.ConfigureSleepTimer = async function (options) { return this._request('ConfigureSleepTimer', options) }
  module.exports = AVTransport
