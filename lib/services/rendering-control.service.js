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
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
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
   * @returns {Promise<{ CurrentBass: number}>} response object.
   */
  async GetBass (options = { InstanceID: 0 }) { return this._request('GetBass', options) }

  /**
   * GetEQ - Get equalizer value
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.EQType - Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = full, 1 = ambient)
   * @remarks Not all EQ types are available on every speaker
   * @returns {Promise<{ CurrentValue: number}>} response object.
   */
  async GetEQ (options) { return this._request('GetEQ', options) }

  /**
   * GetHeadphoneConnected
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ CurrentHeadphoneConnected: boolean}>} response object.
   */
  async GetHeadphoneConnected (options = { InstanceID: 0 }) { return this._request('GetHeadphoneConnected', options) }

  /**
   * GetLoudness - Whether or not Loudness is on
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Promise<{ CurrentLoudness: boolean}>} response object.
   */
  async GetLoudness (options) { return this._request('GetLoudness', options) }

  /**
   * GetMute
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' / 'SpeakerOnly' ]
   * @returns {Promise<{ CurrentMute: boolean}>} response object.
   */
  async GetMute (options) { return this._request('GetMute', options) }

  /**
   * GetOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ CurrentFixed: boolean}>} response object.
   */
  async GetOutputFixed (options = { InstanceID: 0 }) { return this._request('GetOutputFixed', options) }

  /**
   * GetRoomCalibrationStatus
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ RoomCalibrationEnabled: boolean, RoomCalibrationAvailable: boolean}>} response object.
   */
  async GetRoomCalibrationStatus (options = { InstanceID: 0 }) { return this._request('GetRoomCalibrationStatus', options) }

  /**
   * GetSupportsOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ CurrentSupportsFixed: boolean}>} response object.
   */
  async GetSupportsOutputFixed (options = { InstanceID: 0 }) { return this._request('GetSupportsOutputFixed', options) }

  /**
   * GetTreble - Get treble
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ CurrentTreble: number}>} response object.
   */
  async GetTreble (options = { InstanceID: 0 }) { return this._request('GetTreble', options) }

  /**
   * GetVolume - Get volume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Promise<{ CurrentVolume: number}>} response object.
   */
  async GetVolume (options) { return this._request('GetVolume', options) }

  /**
   * GetVolumeDB
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Promise<{ CurrentVolume: number}>} response object.
   */
  async GetVolumeDB (options) { return this._request('GetVolumeDB', options) }

  /**
   * GetVolumeDBRange
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Promise<{ MinValue: number, MaxValue: number}>} response object.
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
   * @returns {Promise<{ RampTime: number}>} response object.
   */
  async RampToVolume (options) { return this._request('RampToVolume', options) }

  /**
   * ResetBasicEQ
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @returns {Promise<{ Bass: number, Treble: number, Loudness: boolean, LeftVolume: number, RightVolume: number}>} response object.
   */
  async ResetBasicEQ (options = { InstanceID: 0 }) { return this._request('ResetBasicEQ', options) }

  /**
   * ResetExtEQ
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.EQType
   * @returns {Promise<Boolean>} request succeeded
   */
  async ResetExtEQ (options) { return this._request('ResetExtEQ', options) }

  /**
   * RestoreVolumePriorToRamp
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @returns {Promise<Boolean>} request succeeded
   */
  async RestoreVolumePriorToRamp (options) { return this._request('RestoreVolumePriorToRamp', options) }

  /**
   * SetBass - Set bass level, between -10 and 10
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.DesiredBass
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetBass (options) { return this._request('SetBass', options) }

  /**
   * SetChannelMap
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.ChannelMap
   * @returns {Promise<Boolean>} request succeeded
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
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetEQ (options) { return this._request('SetEQ', options) }

  /**
   * SetLoudness - Set loudness on / off
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {boolean} options.DesiredLoudness
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetLoudness (options) { return this._request('SetLoudness', options) }

  /**
   * SetMute
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' / 'SpeakerOnly' ]
   * @param {boolean} options.DesiredMute
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetMute (options) { return this._request('SetMute', options) }

  /**
   * SetOutputFixed
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {boolean} options.DesiredFixed
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetOutputFixed (options) { return this._request('SetOutputFixed', options) }

  /**
   * SetRelativeVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.Adjustment
   * @returns {Promise<{ NewVolume: number}>} response object.
   */
  async SetRelativeVolume (options) { return this._request('SetRelativeVolume', options) }

  /**
   * SetRoomCalibrationStatus
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {boolean} options.RoomCalibrationEnabled
   * @returns {Promise<Boolean>} request succeeded
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
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetRoomCalibrationX (options) { return this._request('SetRoomCalibrationX', options) }

  /**
   * SetTreble - Set treble level
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {number} options.DesiredTreble - between -10 and 10
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetTreble (options) { return this._request('SetTreble', options) }

  /**
   * SetVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.DesiredVolume
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetVolume (options) { return this._request('SetVolume', options) }

  /**
   * SetVolumeDB
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.InstanceID - InstanceID should always be `0`
   * @param {string} options.Channel [ 'Master' / 'LF' / 'RF' ]
   * @param {number} options.DesiredVolume
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetVolumeDB (options) { return this._request('SetVolumeDB', options) }
  // #endregion
}

module.exports = RenderingControlService
