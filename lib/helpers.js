/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'debug'
 * @requires 'xml2js
 */

const debug = require('debug')('sonos')
const parseString = require('xml2js').parseString

/**
 * Helper class
 * @class Helpers
 */
var Helpers = {}

/**
 * Wrap in UPnP Envelope
 * @param  {String} body The SOAP body.
 * @return {String}
 */
Helpers.CreateSoapEnvelop = function (body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '<s:Body>' + body + '</s:Body>',
    '</s:Envelope>'].join('')
}

/**
 * Encodes characters not allowed within html/xml tags, for use with nester xml.
 * @param  {String} input
 * @return {String}
 */
Helpers.EncodeXml = function (input) {
  return String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Creates object with uri and metadata from playback uri
 * @param  {String} uri The playback uri (currently supports spotify, tunein)
 * @param  {String} title Sometimes the title is required.
 * @param  {String} region Spotify region is required for all spotify tracks, see `sonos.SpotifyRegion`
 * @return {Object} options       {uri: Spotify uri, metadata: metadata}
 */
Helpers.GenerateMetadata = function (uri, title = '', region = '3079') {
  var parts = uri.split(':')
  if (!((parts.length === 2 && (parts[0] === 'radio' || parts[0] === 'x-sonosapi-stream')) || (parts.length >= 3 && parts[0] === 'spotify'))) {
    debug('Returning string because it isn\'t recognized')
    return {uri: uri, metadata: ''}
  }
  var meta = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="##SPOTIFYURI##" ##PARENTID##restricted="true"><dc:title>##RESOURCETITLE##</dc:title><upnp:class>##SPOTIFYTYPE##</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">##REGION##</desc></item></DIDL-Lite>'

  if (parts[0] === 'radio' || parts[0] === 'x-sonosapi-stream') {
    var radioTitle = title || 'TuneIn Radio'
    if (parts[0] === 'radio') {
      return {
        uri: 'x-sonosapi-stream:s' + parts[1] + '?sid=254&flags=8224&sn=0',
        metadata: meta.replace('##SPOTIFYURI##', 'F00092020s' + parts[1])
          .replace('##RESOURCETITLE##', radioTitle)
          .replace('##SPOTIFYTYPE##', 'object.item.audioItem.audioBroadcast')
          .replace('##PARENTID##', 'parentID="L" ')
          .replace('##REGION##', 'SA_RINCON65031_')
      }
    } else {
      let itemId = parts[1].split('?')[0]
      return {
        uri: uri,
        metadata: meta.replace('##SPOTIFYURI##', 'F00092020' + itemId)
          .replace('##RESOURCETITLE##', radioTitle)
          .replace('##SPOTIFYTYPE##', 'object.item.audioItem.audioBroadcast')
          .replace('##PARENTID##', 'parentID="R:0/0" ')
          .replace('##REGION##', 'SA_RINCON65031_')
      }
    }
  } else {
    meta = meta.replace('##REGION##', 'SA_RINCON' + region + '_X_#Svc' + region + '-0-Token')
  }
  var spotifyUri = uri.replace(/:/g, '%3a')

  if (uri.startsWith('spotify:track:')) { // Just one track
    return {
      uri: 'x-sonos-spotify:' + spotifyUri,
      metadata: meta.replace('##SPOTIFYURI##', '00032020' + spotifyUri)
          .replace('##RESOURCETITLE##', '')
          .replace('##SPOTIFYTYPE##', 'object.item.audioItem.musicTrack')
          .replace('##PARENTID##', '')
    }
  } else if (uri.startsWith('spotify:album:')) { // Album
    return {
      uri: 'x-rincon-cpcontainer:0004206c' + spotifyUri,
      metadata: meta.replace('##SPOTIFYURI##', '0004206c' + spotifyUri)
          .replace('##RESOURCETITLE##', '')
          .replace('##SPOTIFYTYPE##', 'object.container.album.musicAlbum')
          .replace('##PARENTID##', '')
    }
  } else if (uri.startsWith('spotify:artistTopTracks:')) { // Artist top tracks
    return {
      uri: 'x-rincon-cpcontainer:000e206c' + spotifyUri,
      metadata: meta.replace('##SPOTIFYURI##', '000e206c' + spotifyUri)
          .replace('##RESOURCETITLE##', '')
          .replace('##SPOTIFYTYPE##', 'object.container.playlistContainer')
          .replace('##PARENTID##', '')
    }
  } else if (uri.startsWith('spotify:user:')) {
    return {
      uri: 'x-rincon-cpcontainer:10062a6c' + spotifyUri + '?sid=9&flags=10860&sn=7',
      metadata: meta.replace('##SPOTIFYURI##', '10062a6c' + spotifyUri)
          .replace('##RESOURCETITLE##', 'User playlist')
          .replace('##SPOTIFYTYPE##', 'object.container.playlistContainer')
          .replace('##PARENTID##', 'parentID="10082664playlists" ')
    }
  } else if (uri.startsWith('spotify:artistRadio:')) { // Artist radio
    var spotifyTitle = title || 'Artist Radio'
    var parentId = spotifyUri.replace('artistRadio', 'artist')
    return {
      uri: 'x-sonosapi-radio:' + spotifyUri + '?sid=9&flags=8300&sn=7',
      metadata: meta.replace('##SPOTIFYURI##', '100c206c' + spotifyUri)
          .replace('##RESOURCETITLE##', spotifyTitle)
          .replace('##SPOTIFYTYPE##', 'object.item.audioItem.audioBroadcast.#artistRadio')
          .replace('##PARENTID##', 'parentID="10052064' + parentId + '" ')
    }
  } else {
    return {uri: uri, metadata: ''}
  }
}

/**
 * Parse DIDL into track structure
 * @param  {String} didl
 * @param  {String} host host ip
 * @param  {Number} port port numer
 * @return {object}
 */
Helpers.ParseDIDL = function (didl, host, port) {
  debug('ParseDIDL %j %s %d', didl, host, port)
  if ((!didl) || (!didl['DIDL-Lite'])) return {}
  let item = didl['DIDL-Lite'].item

  let track = {
    title: item['dc:title'] || null,
    artist: item['dc:creator'] || null,
    album: item['upnp:album'] || null,
    albumArtURI: item['upnp:albumArtURI'] || null
  }
  if (host && port && track.albumArtURI && !track.albumArtURI.startsWith('http://')) {
    track.albumArtURI = 'http://' + host + ':' + port + track.albumArtURI
  }
  return track
}

/**
 * Convert a time string to seconds
 * @param  {String} time like `00:03:34`
 * @returns {Number} number of seconds like 214
 */
Helpers.TimeToSeconds = function (time) {
  let timeSplit = time.split(':')
  return (parseInt(timeSplit[0], 10) * 60 * 60) +
          (parseInt(timeSplit[1], 10) * 60) +
          parseInt(timeSplit[2], 10)
}

Helpers._ParseXml = function (input, callback) {
  return parseString(input, {mergeAttrs: true, explicitArray: false}, callback)
}

/**
 * Parse Xml to an object async
 * @param {String} input The XML to be parsed
 * @return {Promise}
 */
Helpers.ParseXml = async function (input) {
  debug('Helpers.ParseXml %j', input)
  return new Promise((resolve, reject) => {
    Helpers._ParseXml(input, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = Helpers
