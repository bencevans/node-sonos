/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of DeviceProperties
 * @class DeviceProperties
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class DeviceProperties extends Service {
  constructor (host, port) {
    super()
    this.name = 'DeviceProperties'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/DeviceProperties/Control'
    this.eventSubURL = '/DeviceProperties/Event'
    this.SCPDURL = '/xml/DeviceProperties1.xml'
  }

  async SetLEDState (state) { return this._request('SetLEDState', { DesiredLEDState: state }) }

  async GetLEDState () { return this._request('GetLEDState').then(result => { return result.CurrentLEDState }) }

  async SetInvisible (options) { return this._request('SetInvisible', options) }

  async GetInvisible (options) { return this._request('GetInvisible', options) }

  async AddBondedZones (options) { return this._request('AddBondedZones', options) }

  async RemoveBondedZones (options) { return this._request('RemoveBondedZones', options) }

  async CreateStereoPair (options) { return this._request('CreateStereoPair', options) }

  async SeparateStereoPair (options) { return this._request('SeparateStereoPair', options) }

  /**
 * Set the attributes of this speaker
 * @param {object} options Object with required parameters
 * @param {string} options.DesiredZoneName The name of the speaker
 * @param {string} options.DesiredIcon The icon of the speaker
 * @param {string} options.DesiredConfiguration The config of the speaker
 */
  async SetZoneAttributes (options) { return this._request('SetZoneAttributes', options) }

  async GetZoneAttributes () { return this._request('GetZoneAttributes') }

  async GetHouseholdID (options) { return this._request('GetHouseholdID', options) }

  async GetZoneInfo () { return this._request('GetZoneInfo') }

  async SetAutoplayLinkedZones (options) { return this._request('SetAutoplayLinkedZones', options) }

  async GetAutoplayLinkedZones (options) { return this._request('GetAutoplayLinkedZones', options) }

  async SetAutoplayRoomUUID (options) { return this._request('SetAutoplayRoomUUID', options) }

  async GetAutoplayRoomUUID (options) { return this._request('GetAutoplayRoomUUID', options) }

  async SetAutoplayVolume (options) { return this._request('SetAutoplayVolume', options) }

  async GetAutoplayVolume (options) { return this._request('GetAutoplayVolume', options) }

  async ImportSetting (options) { return this._request('ImportSetting', options) }

  async SetUseAutoplayVolume (options) { return this._request('SetUseAutoplayVolume', options) }

  async GetUseAutoplayVolume (options) { return this._request('GetUseAutoplayVolume', options) }

  async AddHTSatellite (options) { return this._request('AddHTSatellite', options) }

  async RemoveHTSatellite (options) { return this._request('RemoveHTSatellite', options) }
}

module.exports = DeviceProperties
