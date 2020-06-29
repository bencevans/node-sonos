/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of RenderingControl
 * @class RenderingControl
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var RenderingControl = function (host, port) {
  this.name = 'RenderingControl'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MediaRenderer/RenderingControl/Control'
  this.eventSubURL = '/MediaRenderer/RenderingControl/Event'
  this.SCPDURL = '/xml/RenderingControl1.xml'
}

util.inherits(RenderingControl, Service)
/**
 * Get the volume
 * @param {string} channel Get to volume for this channel, `Master` is default.
 */
RenderingControl.prototype.GetVolume = async function (channel = 'Master') {
  return this._request('GetVolume', { InstanceID: 0, Channel: channel })
    .then(result => {
      return parseInt(result.CurrentVolume, 10)
    })
}

/**
 * Set the volume for a speaker.
 * @param {number} volume The volume you want (0-100)
 * @param {string} channel The channel you want to set `Master` is default
 */
RenderingControl.prototype.SetVolume = async function (volume, channel = 'Master') { return this._request('SetVolume', { InstanceID: 0, Channel: channel, DesiredVolume: volume }) }

/**
 * Adjust volume with relative value
 * @param {number} volumeAdjustment The volume adjustment
 * @param {string} channel The channel you want to set. `Master` is default
 */
RenderingControl.prototype.SetRelativeVolume = async function (volumeAdjustment, channel = 'Master') {
  return this._request('SetRelativeVolume', { InstanceID: 0, Channel: channel, Adjustment: volumeAdjustment })
    .then(result => {
      return parseInt(result.NewVolume, 10)
    })
}

/**
 * Check if the speaker is muted
 * @param {string} channel What channel do you want to check? `Master` is default.
 */
RenderingControl.prototype.GetMute = async function (channel = 'Master') {
  return this._request('GetMute', { InstanceID: 0, Channel: channel })
    .then(result => {
      return (!!parseInt(result.CurrentMute, 10))
    })
}

/**
 * (Un)mute the volume of a speaker.
 * @param {boolean} mute Should it be muted or unmuted?
 * @param {string} channel The channel you want to set. `Master` is default
 */
RenderingControl.prototype.SetMute = async function (mute, channel = 'Master') {
  return this._request('SetMute', {
    InstanceID: 0,
    Channel: channel,
    DesiredMute: (mute ? '1' : '0')
  })
}

/**
 * Get loudness value of a speaker.
 * @param {string} channel What channel do you want to check? `Master` is default
 */
RenderingControl.prototype.GetLoudness = async (Channel = 'Master') => {
  return this._request('GetLoudness', {
    InstanceID: 0,
    Channel
  }).then((r) => parseInt(r.CurrentLoudness))
}

/**
 * (Un)set loudness of a speaker.
 * @param {boolean} loudness Should it be with or without loudness?
 * @param {string} channel The channel you want to set. `Master` is default
 */
RenderingControl.prototype.SetLoudness = async function (loudness, Channel = 'Master') {
  return this._request('SetLoudness', {
    InstanceID: 0,
    Channel,
    DesiredLoudness: (loudness ? '1' : '0')
  })
}

/**
 * Get bass value of a speaker.
*/
RenderingControl.prototype.GetBass = async function () {
  return this._request('GetBass', { InstanceID: 0 }).then((r) =>
    parseInt(r.CurrentBass)
  )
}

/**
 * (Un)set bass of a speaker.
 * @param {boolean} loudness Should it be with or without bass?
 */
RenderingControl.prototype.SetBass = async function (bass) {
  return this._request('SetBass', {
    InstanceID: 0,
    DesiredBass: (bass ? '1' : '0')
  })
}

/**
 * Get treble value of a speaker.
*/
RenderingControl.prototype.GetTreble = async function () {
  return this._request('GetTreble', { InstanceID: 0 }).then((r) =>
    parseInt(r.CurrentTreble)
  )
}

/**
 * (Un)set treble of a speaker.
 * @param {boolean} treble Should it be with or without treble?
 */
RenderingControl.prototype.SetTreble = async function (treble) {
  return this._request('SetTreble', {
    InstanceID: 0,
    DesiredTreble: (treble ? '1' : '0')
  })
}

/**
 * Get room calibration status, returns { RoomCalibrationEnabled, RoomCalibrationAvailable }
 * @param {string} channel What channel do you want to check? `Master` is default.
 */
RenderingControl.prototype.GetRoomCalibrationStatus = async function () {
  return this._request('GetRoomCalibrationStatus', {
    InstanceID: 0
  })
}

/**
 * (Un)set room calibration status (TruePlay) of a speaker.
 * @param {boolean} enabled Should it be with or without treble?
 */
RenderingControl.prototype.SetRoomCalibrationStatus = async function (enabled) {
  return this._request('SetRoomCalibrationStatus', {
    InstanceID: 0,
    RoomCalibrationEnabled: (enabled ? '1' : '0')
  })
}

module.exports = RenderingControl
