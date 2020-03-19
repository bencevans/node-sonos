/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires '../Helpers'
 */

const util = require('util')
const Service = require('./Service')
const Helpers = require('../helpers')

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
ContentDirectory.prototype.DestroyObject = async function (options) { return this._request('DestroyObject', options) }

ContentDirectory.prototype._parseResult = async function (input) {
  input.Result = await Helpers.ParseXml(input.Result)
  return input
}

ContentDirectory.prototype._enumItems = function (resultcontainer) {
  if (resultcontainer === undefined) return
  if (Array.isArray(resultcontainer)) {
    const convertItem = function (item) {
      return Helpers.ParseDIDLItem(item, this.host, this.port, item.res._)
    }.bind(this)

    return resultcontainer.map(convertItem)
  } else {
    return [Helpers.ParseDIDLItem(resultcontainer, this.host, this.port, resultcontainer.res._)]
  }
}

ContentDirectory.prototype.GetResult = async function (options) {
  return this.Browse(options)
    .then(this._parseResult)
    .then(data => {
      let items = []
      if (data.Result['DIDL-Lite'].container) {
        items = this._enumItems(data.Result['DIDL-Lite'].container)
      } else {
        items = this._enumItems(data.Result['DIDL-Lite'].item)
      }

      return {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        updateID: data.UpdateID,
        items: items
      }
    })
}

module.exports = ContentDirectory
