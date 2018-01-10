/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of GroupManagement
 * @class GroupManagement
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var GroupManagement = function (host, port) {
  this.name = 'GroupManagement'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/GroupManagement/Control'
  this.eventSubURL = '/GroupManagement/Event'
  this.SCPDURL = '/xml/GroupManagement1.xml'
}

util.inherits(GroupManagement, Service)

GroupManagement.prototype.AddMember = function (options, callback) { this._request('AddMember', options, callback) }
GroupManagement.prototype.RemoveMember = function (options, callback) { this._request('RemoveMember', options, callback) }
GroupManagement.prototype.ReportTrackBufferingResult = function (options, callback) { this._request('ReportTrackBufferingResult', options, callback) }

module.exports = GroupManagement
