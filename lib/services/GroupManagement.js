/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of GroupManagement
 * @class GroupManagement
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class GroupManagement extends Service {
  constructor (host, port) {
    super()
    this.name = 'GroupManagement'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/GroupManagement/Control'
    this.eventSubURL = '/GroupManagement/Event'
    this.SCPDURL = '/xml/GroupManagement1.xml'
  }

  async AddMember (options) { return this._request('AddMember', options) }

  async RemoveMember (options) { return this._request('RemoveMember', options) }

  async ReportTrackBufferingResult (options) { return this._request('ReportTrackBufferingResult', options) }
}

module.exports = GroupManagement
