const Service = require('./Service')
/**
 * Sonos RenderingControlService
 *
 * Volume related controls
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class RenderingControlService
 * @extends {Service}
 */
class RenderingControlService extends Service {
  constructor (host, port) {
    super()
    this.name = 'RenderingControl'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/RenderingControl/Control'
    this.eventSubURL = '/MediaRenderer/RenderingControl/Event'
    this.SCPDURL = '/xml/RenderingControl1.xml'
  }

  // #region actions
  /**
   * GetBass - Get bass level between -10 and 10
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'CurrentBass'
   */
  async GetBass (options = { InstanceID: 0 }) { return this._request('GetBass', options) }

  /**
   * GetEQ - Get equalizer value
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.EQType - Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = full, 1 = ambient)
   * @remarks Not all EQ types are available on every speaker
   * @returns {Object} response object, with these properties 'CurrentValue'
   */
  async GetEQ (options) { return this._request('GetEQ', options) }

  /**
   * GetHeadphoneConnected
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'CurrentHeadphoneConnected'
   */
  async GetHeadphoneConnected (options = { InstanceID: 0 }) { return this._request('GetHeadphoneConnected', options) }

  /**
   * GetLoudness - Whether or not Loudness is on
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Object} response object, with these properties 'CurrentLoudness'
   */
  async GetLoudness (options) { return this._request('GetLoudness', options) }

  /**
   * GetMute
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' / 'SpeakerOnly' ]
   * @returns {Object} response object, with these properties 'CurrentMute'
   */
  async GetMute (options) { return this._request('GetMute', options) }

  /**
   * GetOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'CurrentFixed'
   */
  async GetOutputFixed (options = { InstanceID: 0 }) { return this._request('GetOutputFixed', options) }

  /**
   * GetRoomCalibrationStatus
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'RoomCalibrationEnabled', 'RoomCalibrationAvailable'
   */
  async GetRoomCalibrationStatus (options = { InstanceID: 0 }) { return this._request('GetRoomCalibrationStatus', options) }

  /**
   * GetSupportsOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'CurrentSupportsFixed'
   */
  async GetSupportsOutputFixed (options = { InstanceID: 0 }) { return this._request('GetSupportsOutputFixed', options) }

  /**
   * GetTreble - Get treble
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'CurrentTreble'
   */
  async GetTreble (options = { InstanceID: 0 }) { return this._request('GetTreble', options) }

  /**
   * GetVolume - Get volume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Object} response object, with these properties 'CurrentVolume'
   */
  async GetVolume (options) { return this._request('GetVolume', options) }

  /**
   * GetVolumeDB
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Object} response object, with these properties 'CurrentVolume'
   */
  async GetVolumeDB (options) { return this._request('GetVolumeDB', options) }

  /**
   * GetVolumeDBRange
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Object} response object, with these properties 'MinValue', 'MaxValue'
   */
  async GetVolumeDBRange (options) { return this._request('GetVolumeDBRange', options) }

  /**
   * RampToVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {string} options.RampType [ 'SLEEP_TIMER_RAMP_TYPE' / 'ALARM_RAMP_TYPE' / 'AUTOPLAY_RAMP_TYPE' ]
   * @param {number} options.DesiredVolume
   * @param {boolean} options.ResetVolumeAfter
   * @param {string} options.ProgramURI
   * @returns {Object} response object, with these properties 'RampTime'
   */
  async RampToVolume (options) { return this._request('RampToVolume', options) }

  /**
   * ResetBasicEQ
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Object} response object, with these properties 'Bass', 'Treble', 'Loudness', 'LeftVolume', 'RightVolume'
   */
  async ResetBasicEQ (options = { InstanceID: 0 }) { return this._request('ResetBasicEQ', options) }

  /**
   * ResetExtEQ
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.EQType
   */
  async ResetExtEQ (options) { return this._request('ResetExtEQ', options) }

  /**
   * RestoreVolumePriorToRamp
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   */
  async RestoreVolumePriorToRamp (options) { return this._request('RestoreVolumePriorToRamp', options) }

  /**
   * SetBass - Set bass level, between -10 and 10
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.DesiredBass
   */
  async SetBass (options) { return this._request('SetBass', options) }

  /**
   * SetChannelMap
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.ChannelMap
   */
  async SetChannelMap (options) { return this._request('SetChannelMap', options) }

  /**
   * SetEQ - Set equalizer value for different types
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.EQType - Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = full, 1 = ambient)
   * @param {number} options.DesiredValue - Booleans required `1` for true or `0` for false, rest number as specified
   * @remarks Not supported by all speakers, TV related
   */
  async SetEQ (options) { return this._request('SetEQ', options) }

  /**
   * SetLoudness - Set loudness on / off
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {boolean} options.DesiredLoudness
   */
  async SetLoudness (options) { return this._request('SetLoudness', options) }

  /**
   * SetMute
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' / 'SpeakerOnly' ]
   * @param {boolean} options.DesiredMute
   */
  async SetMute (options) { return this._request('SetMute', options) }

  /**
   * SetOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {boolean} options.DesiredFixed
   */
  async SetOutputFixed (options) { return this._request('SetOutputFixed', options) }

  /**
   * SetRelativeVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.Adjustment
   * @returns {Object} response object, with these properties 'NewVolume'
   */
  async SetRelativeVolume (options) { return this._request('SetRelativeVolume', options) }

  /**
   * SetRoomCalibrationStatus
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {boolean} options.RoomCalibrationEnabled
   */
  async SetRoomCalibrationStatus (options) { return this._request('SetRoomCalibrationStatus', options) }

  /**
   * SetRoomCalibrationX
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.CalibrationID
   * @param {string} options.Coefficients
   * @param {string} options.CalibrationMode
   */
  async SetRoomCalibrationX (options) { return this._request('SetRoomCalibrationX', options) }

  /**
   * SetTreble - Set treble level
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.DesiredTreble - between -10 and 10
   */
  async SetTreble (options) { return this._request('SetTreble', options) }

  /**
   * SetVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.DesiredVolume
   */
  async SetVolume (options) { return this._request('SetVolume', options) }

  /**
   * SetVolumeDB
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.DesiredVolume
   */
  async SetVolumeDB (options) { return this._request('SetVolumeDB', options) }
  // #endregion
}

module.exports = RenderingControlService
