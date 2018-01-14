/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

  const util = require('util')
  const Service = require('./Service')

  /**
   * Create a new instance of ContentDirectory
   * @class ContentDirectory
   * @param {String} host The host param of one of your sonos speakers
   * @param {Number} port The port of your sonos speaker, defaults to 1400
   */
  var ContentDirectory = function (host, port) {
    this.name = 'ContentDirectory'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaServer/ContentDirectory/Control'
    this.eventSubURL = '/MediaServer/ContentDirectory/Event'
    this.SCPDURL = '/xml/ContentDirectory1.xml'
  }

  util.inherits(ContentDirectory, Service)

  ContentDirectory.prototype.Browse = async function (options) { return this._request('Browse', options) }

  module.exports = ContentDirectory
