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
  AVTransport.prototype.GetMediaInfo = async function () { return this._request('GetMediaInfo', {'InstanceID': 0}) }
  AVTransport.prototype.GetTransportInfo = async function () { return this._request('GetTransportInfo', {'InstanceID': 0}) }
  AVTransport.prototype.GetPositionInfo = async function () { return this._request('GetPositionInfo', {'InstanceID': 0}) }
  AVTransport.prototype.GetDeviceCapabilities = async function () { return this._request('GetDeviceCapabilities', {'InstanceID': 0}) }
  AVTransport.prototype.GetTransportSettings = async function () { return this._request('GetTransportSettings', {'InstanceID': 0}) }
  AVTransport.prototype.GetCrossfadeMode = async function () { return this._request('GetCrossfadeMode', {'InstanceID': 0}) }
  AVTransport.prototype.Stop = async function () { return this._request('Stop', {'InstanceID': 0}) }
  AVTransport.prototype.Play = async function () { return this._request('Play', {'InstanceID': 0}) }
  AVTransport.prototype.Pause = async function () { return this._request('Pause', {'InstanceID': 0}) }
  AVTransport.prototype.Seek = async function (options) { return this._request('Seek', options) }
  AVTransport.prototype.Next = async function () { return this._request('Next', {'InstanceID': 0}) }
  AVTransport.prototype.NextProgrammedRadioTracks = async function () { return this._request('NextProgrammedRadioTracks') }
  AVTransport.prototype.Previous = async function () { return this._request('Previous', {'InstanceID': 0}) }
  AVTransport.prototype.NextSection = async function (options) { return this._request('NextSection', options) }
  AVTransport.prototype.PreviousSection = async function (options) { return this._request('PreviousSection', options) }
  AVTransport.prototype.SetPlayMode = async function (options) { return this._request('SetPlayMode', options) }
  AVTransport.prototype.SetCrossfadeMode = async function (options) { return this._request('SetCrossfadeMode', options) }
  AVTransport.prototype.NotifyDeletedURI = async function (options) { return this._request('NotifyDeletedURI', options) }
  AVTransport.prototype.GetCurrentTransportActions = async function () { return this._request('GetCurrentTransportActions', {'InstanceID': 0}) }
  AVTransport.prototype.BecomeCoordinatorOfStandaloneGroup = async function () { return this._request('BecomeCoordinatorOfStandaloneGroup', {'InstanceID': 0}) }
  AVTransport.prototype.DelegateGroupCoordinationTo = async function (options) { return this._request('DelegateGroupCoordinationTo', options) }
  AVTransport.prototype.BecomeGroupCoordinator = async function (options) { return this._request('BecomeGroupCoordinator', options) }
  AVTransport.prototype.BecomeGroupCoordinatorAndSource = async function (options) { return this._request('BecomeGroupCoordinatorAndSource', options) }
  AVTransport.prototype.ConfigureSleepTimer = async function (options) { return this._request('ConfigureSleepTimer', options) }
  AVTransport.prototype.GetRemainingSleepTimerDuration = async function () { return this._request('GetRemainingSleepTimerDuration', {'InstanceID': 0}) }
  module.exports = AVTransport
