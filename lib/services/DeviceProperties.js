/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

  const util = require('util')
  const Service = require('./Service')

  /**
   * Create a new instance of DeviceProperties
   * @class DeviceProperties
   * @param {String} host The host param of one of your sonos speakers
   * @param {Number} port The port of your sonos speaker, defaults to 1400
   */
  var DeviceProperties = function (host, port) {
    this.name = 'DeviceProperties'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/DeviceProperties/Control'
    this.eventSubURL = '/DeviceProperties/Event'
    this.SCPDURL = '/xml/DeviceProperties1.xml'
  }

  util.inherits(DeviceProperties, Service)

  DeviceProperties.prototype.SetLEDState = async function (options) { return this._request('SetLEDState', options) }
  DeviceProperties.prototype.GetLEDState = async function (options) { return this._request('GetLEDState', options) }
  DeviceProperties.prototype.SetInvisible = async function (options) { return this._request('SetInvisible', options) }
  DeviceProperties.prototype.GetInvisible = async function (options) { return this._request('GetInvisible', options) }
  DeviceProperties.prototype.AddBondedZones = async function (options) { return this._request('AddBondedZones', options) }
  DeviceProperties.prototype.RemoveBondedZones = async function (options) { return this._request('RemoveBondedZones', options) }
  DeviceProperties.prototype.CreateStereoPair = async function (options) { return this._request('CreateStereoPair', options) }
  DeviceProperties.prototype.SeparateStereoPair = async function (options) { return this._request('SeparateStereoPair', options) }
  DeviceProperties.prototype.SetZoneAttributes = async function (options) { return this._request('SetZoneAttributes', options) }
  DeviceProperties.prototype.GetZoneAttributes = async function (options) { return this._request('GetZoneAttributes', options) }
  DeviceProperties.prototype.GetHouseholdID = async function (options) { return this._request('GetHouseholdID', options) }
  DeviceProperties.prototype.GetZoneInfo = async function (options) { return this._request('GetZoneInfo', options) }
  DeviceProperties.prototype.SetAutoplayLinkedZones = async function (options) { return this._request('SetAutoplayLinkedZones', options) }
  DeviceProperties.prototype.GetAutoplayLinkedZones = async function (options) { return this._request('GetAutoplayLinkedZones', options) }
  DeviceProperties.prototype.SetAutoplayRoomUUID = async function (options) { return this._request('SetAutoplayRoomUUID', options) }
  DeviceProperties.prototype.GetAutoplayRoomUUID = async function (options) { return this._request('GetAutoplayRoomUUID', options) }
  DeviceProperties.prototype.SetAutoplayVolume = async function (options) { return this._request('SetAutoplayVolume', options) }
  DeviceProperties.prototype.GetAutoplayVolume = async function (options) { return this._request('GetAutoplayVolume', options) }
  DeviceProperties.prototype.ImportSetting = async function (options) { return this._request('ImportSetting', options) }
  DeviceProperties.prototype.SetUseAutoplayVolume = async function (options) { return this._request('SetUseAutoplayVolume', options) }
  DeviceProperties.prototype.GetUseAutoplayVolume = async function (options) { return this._request('GetUseAutoplayVolume', options) }
  DeviceProperties.prototype.AddHTSatellite = async function (options) { return this._request('AddHTSatellite', options) }
  DeviceProperties.prototype.RemoveHTSatellite = async function (options) { return this._request('RemoveHTSatellite', options) }

  module.exports = DeviceProperties
