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
  return this._request('GetVolume', {InstanceID: 0, Channel: channel})
    .then(result => {
      return parseInt(result.CurrentVolume, 10)
    })
}

/**
 * Set the volume for a speaker.
 * @param {number} volume The volume you want (0-100)
 * @param {string} channel The channel you want to set `Master` is default
 */
RenderingControl.prototype.SetVolume = async function (volume, channel = 'Master') { return this._request('SetVolume', {InstanceID: 0, Channel: channel, DesiredVolume: volume}) }

/**
 * Check if the speaker is muted
 * @param {string} channel What channel do you want to check? `Master` is default.
 */
RenderingControl.prototype.GetMute = async function (channel = 'Master') {
  return this._request('GetMute', {InstanceID: 0, Channel: channel})
  .then(result => {
    return (!!parseInt(result.CurrentMute, 10))
  })
}

/**
 * (Un)mute the volume of a speaker.
 * @param {boolean} mute Should it be muted or unmuted?
 * @param {string} channel The channel you want to set `Master` is default
 */
RenderingControl.prototype.SetMute = async function (mute, channel = 'Master') { return this._request('SetMute', {InstanceID: 0, Channel: channel, DesiredMute: (mute ? '1' : '0')}) }

module.exports = RenderingControl
