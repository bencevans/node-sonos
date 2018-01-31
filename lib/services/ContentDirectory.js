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

var parseResult = async function (input) {
  return Helpers.ParseXml(input.Result)
}

ContentDirectory.prototype._enumItems = function (resultcontainer) {
  const convertItem = function (item) {
    let albumArtUrl = item['upnp:albumArtURI'] || null

    if (albumArtUrl && !albumArtUrl.startsWith('http')) {
      albumArtUrl = 'http://' + this.host + ':' + this.port + albumArtUrl
    }

    return {
      'title': item['dc:title'] || null,
      'artist': item['dc:creator'] || null,
      'album': item['dc:album'] || null,
      'uri': item.res._ || null,
      'albumArtURL': albumArtUrl
    }
  }

  return resultcontainer.map(convertItem)
}

ContentDirectory.prototype.GetResult = async function (options) {
  return this.Browse(options)
    .then(async data => {
      let result = await parseResult(data)
      let items = []
      if (result['DIDL-Lite'].container) {
        items = this._enumItems(result['DIDL-Lite'].container)
      } else {
        items = this._enumItems(result['DIDL-Lite'].item)
      }

      return {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      }
    })
}

module.exports = ContentDirectory
