/**
 * A service to modify everything related to GroupRenderingControl
 * @module GroupRenderingControl
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var GroupRenderingControl = function (host, port) {
  this.name = 'GroupRenderingControl'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MediaRenderer/GroupRenderingControl/Control'
  this.eventSubURL = '/MediaRenderer/GroupRenderingControl/Event'
  this.SCPDURL = '/xml/GroupRenderingControl1.xml'
}

util.inherits(GroupRenderingControl, Service)

module.exports = GroupRenderingControl
