/**
  * A service to modify everything related to DeviceProperties
  * @module DeviceProperties
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

  DeviceProperties.prototype.SetLEDState = function (options, callback) { this._request('SetLEDState', options, callback) }
  DeviceProperties.prototype.GetLEDState = function (options, callback) { this._request('GetLEDState', options, callback) }
  DeviceProperties.prototype.SetInvisible = function (options, callback) { this._request('SetInvisible', options, callback) }
  DeviceProperties.prototype.GetInvisible = function (options, callback) { this._request('GetInvisible', options, callback) }
  DeviceProperties.prototype.AddBondedZones = function (options, callback) { this._request('AddBondedZones', options, callback) }
  DeviceProperties.prototype.RemoveBondedZones = function (options, callback) { this._request('RemoveBondedZones', options, callback) }
  DeviceProperties.prototype.CreateStereoPair = function (options, callback) { this._request('CreateStereoPair', options, callback) }
  DeviceProperties.prototype.SeparateStereoPair = function (options, callback) { this._request('SeparateStereoPair', options, callback) }
  DeviceProperties.prototype.SetZoneAttributes = function (options, callback) { this._request('SetZoneAttributes', options, callback) }
  DeviceProperties.prototype.GetZoneAttributes = function (options, callback) { this._request('GetZoneAttributes', options, callback) }
  DeviceProperties.prototype.GetHouseholdID = function (options, callback) { this._request('GetHouseholdID', options, callback) }
  DeviceProperties.prototype.GetZoneInfo = function (options, callback) { this._request('GetZoneInfo', options, callback) }
  DeviceProperties.prototype.SetAutoplayLinkedZones = function (options, callback) { this._request('SetAutoplayLinkedZones', options, callback) }
  DeviceProperties.prototype.GetAutoplayLinkedZones = function (options, callback) { this._request('GetAutoplayLinkedZones', options, callback) }
  DeviceProperties.prototype.SetAutoplayRoomUUID = function (options, callback) { this._request('SetAutoplayRoomUUID', options, callback) }
  DeviceProperties.prototype.GetAutoplayRoomUUID = function (options, callback) { this._request('GetAutoplayRoomUUID', options, callback) }
  DeviceProperties.prototype.SetAutoplayVolume = function (options, callback) { this._request('SetAutoplayVolume', options, callback) }
  DeviceProperties.prototype.GetAutoplayVolume = function (options, callback) { this._request('GetAutoplayVolume', options, callback) }
  DeviceProperties.prototype.ImportSetting = function (options, callback) { this._request('ImportSetting', options, callback) }
  DeviceProperties.prototype.SetUseAutoplayVolume = function (options, callback) { this._request('SetUseAutoplayVolume', options, callback) }
  DeviceProperties.prototype.GetUseAutoplayVolume = function (options, callback) { this._request('GetUseAutoplayVolume', options, callback) }
  DeviceProperties.prototype.AddHTSatellite = function (options, callback) { this._request('AddHTSatellite', options, callback) }
  DeviceProperties.prototype.RemoveHTSatellite = function (options, callback) { this._request('RemoveHTSatellite', options, callback) }

  module.exports = DeviceProperties
