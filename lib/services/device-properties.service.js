const Service = require('./Service')
/**
 * Sonos DevicePropertiesService
 *
 * Modify device properties, like LED status and stereo pairs
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class DevicePropertiesService
 * @extends {Service}
 */
class DevicePropertiesService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'DeviceProperties'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/DeviceProperties/Control'
    this.eventSubURL = '/DeviceProperties/Event'
    this.SCPDURL = '/xml/DeviceProperties1.xml'
  }

  // #region actions
  /**
   * AddBondedZones
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ChannelMapSet
   * @returns {Promise<Boolean>} request succeeded
   */
  async AddBondedZones (options) { return this._request('AddBondedZones', options) }

  /**
   * AddHTSatellite
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.HTSatChanMapSet
   * @returns {Promise<Boolean>} request succeeded
   */
  async AddHTSatellite (options) { return this._request('AddHTSatellite', options) }

  /**
   * CreateStereoPair - Create a stereo pair (left, right speakers), right one becomes hidden
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks No all speakers support StereoPairs
   * @returns {Promise<Boolean>} request succeeded
   */
  async CreateStereoPair (options) { return this._request('CreateStereoPair', options) }

  /**
   * EnterConfigMode
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Mode
   * @param {string} options.Options
   * @returns {Promise<{ State: string}>} response object.
   */
  async EnterConfigMode (options) { return this._request('EnterConfigMode', options) }

  /**
   * ExitConfigMode
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Options
   * @returns {Promise<Boolean>} request succeeded
   */
  async ExitConfigMode (options) { return this._request('ExitConfigMode', options) }

  /**
   * GetAutoplayLinkedZones
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Source
   * @returns {Promise<{ IncludeLinkedZones: boolean}>} response object.
   */
  async GetAutoplayLinkedZones (options) { return this._request('GetAutoplayLinkedZones', options) }

  /**
   * GetAutoplayRoomUUID
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Source
   * @returns {Promise<{ RoomUUID: string}>} response object.
   */
  async GetAutoplayRoomUUID (options) { return this._request('GetAutoplayRoomUUID', options) }

  /**
   * GetAutoplayVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Source
   * @returns {Promise<{ CurrentVolume: number}>} response object.
   */
  async GetAutoplayVolume (options) { return this._request('GetAutoplayVolume', options) }

  /**
   * GetButtonLockState - Get the current button lock state
   * @returns {Promise<{ CurrentButtonLockState: string}>} response object.
   */
  async GetButtonLockState () { return this._request('GetButtonLockState') }

  /**
   * GetButtonState
   * @returns {Promise<{ State: string}>} response object.
   */
  async GetButtonState () { return this._request('GetButtonState') }

  /**
   * GetHouseholdID
   * @returns {Promise<{ CurrentHouseholdID: string}>} response object.
   */
  async GetHouseholdID () { return this._request('GetHouseholdID') }

  /**
   * GetLEDState - Get the current LED state
   * @returns {Promise<{ CurrentLEDState: string}>} response object.
   */
  async GetLEDState () { return this._request('GetLEDState') }

  /**
   * GetUseAutoplayVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.Source
   * @returns {Promise<{ UseVolume: boolean}>} response object.
   */
  async GetUseAutoplayVolume (options) { return this._request('GetUseAutoplayVolume', options) }

  /**
   * GetZoneAttributes
   * @returns {Promise<{ CurrentZoneName: string, CurrentIcon: string, CurrentConfiguration: string}>} response object.
   */
  async GetZoneAttributes () { return this._request('GetZoneAttributes') }

  /**
   * GetZoneInfo - Get information about this specific speaker
   * @returns {Promise<{ SerialNumber: string, SoftwareVersion: string, DisplaySoftwareVersion: string, HardwareVersion: string, IPAddress: string, MACAddress: string, CopyrightInfo: string, ExtraInfo: string, HTAudioIn: number, Flags: number}>} response object.
   */
  async GetZoneInfo () { return this._request('GetZoneInfo') }

  /**
   * RemoveBondedZones
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ChannelMapSet
   * @param {boolean} options.KeepGrouped
   * @returns {Promise<Boolean>} request succeeded
   */
  async RemoveBondedZones (options) { return this._request('RemoveBondedZones', options) }

  /**
   * RemoveHTSatellite
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.SatRoomUUID
   * @returns {Promise<Boolean>} request succeeded
   */
  async RemoveHTSatellite (options) { return this._request('RemoveHTSatellite', options) }

  /**
   * RoomDetectionStartChirping
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.Channel
   * @param {number} options.DurationMilliseconds
   * @returns {Promise<{ PlayId: number, ChirpIfPlayingSwappableAudio: boolean}>} response object.
   */
  async RoomDetectionStartChirping (options) { return this._request('RoomDetectionStartChirping', options) }

  /**
   * RoomDetectionStopChirping
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.PlayId
   * @returns {Promise<Boolean>} request succeeded
   */
  async RoomDetectionStopChirping (options) { return this._request('RoomDetectionStopChirping', options) }

  /**
   * SeparateStereoPair - Separate a stereo pair
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
   * @remarks No all speakers support StereoPairs
   * @returns {Promise<Boolean>} request succeeded
   */
  async SeparateStereoPair (options) { return this._request('SeparateStereoPair', options) }

  /**
   * SetAutoplayLinkedZones
   *
   * @param {Object} [options] - An object with the following properties
   * @param {boolean} options.IncludeLinkedZones
   * @param {string} options.Source
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetAutoplayLinkedZones (options) { return this._request('SetAutoplayLinkedZones', options) }

  /**
   * SetAutoplayRoomUUID
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.RoomUUID
   * @param {string} options.Source
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetAutoplayRoomUUID (options) { return this._request('SetAutoplayRoomUUID', options) }

  /**
   * SetAutoplayVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.Volume
   * @param {string} options.Source
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetAutoplayVolume (options) { return this._request('SetAutoplayVolume', options) }

  /**
   * SetButtonLockState - Set the button lock state
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredButtonLockState [ 'On' / 'Off' ]
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetButtonLockState (options) { return this._request('SetButtonLockState', options) }

  /**
   * SetLEDState - Set the LED state
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredLEDState [ 'On' / 'Off' ]
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetLEDState (options) { return this._request('SetLEDState', options) }

  /**
   * SetUseAutoplayVolume
   *
   * @param {Object} [options] - An object with the following properties
   * @param {boolean} options.UseVolume
   * @param {string} options.Source
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetUseAutoplayVolume (options) { return this._request('SetUseAutoplayVolume', options) }

  /**
   * SetZoneAttributes
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredZoneName
   * @param {string} options.DesiredIcon
   * @param {string} options.DesiredConfiguration
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetZoneAttributes (options) { return this._request('SetZoneAttributes', options) }
  // #endregion
}

module.exports = DevicePropertiesService
