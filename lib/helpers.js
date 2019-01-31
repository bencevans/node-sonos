/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'debug'
 * @requires 'xml2js
 */

const debug = require('debug')('sonos:helpers')
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
  return [// '<?xml version="1.0" encoding="utf-8"?>',
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
 * Converts parentID to upnp cass
 * @param {String} parentID The id of the parent
 * @return {String} object.item.audioItem.musicTrack
 */
Helpers.GetUpnpClass = function (parentID) {
  switch (parentID) {
    case 'A:ALBUMS':
      return 'object.item.audioItem.musicAlbum'
    case 'A:TRACKS':
      return 'object.item.audioItem.musicTrack'
    case 'A:ALBUMARTIST':
      return 'object.item.audioItem.musicArtist'
    case 'A:GENRE':
      return 'object.container.genre.musicGenre'
    case 'A:COMPOSER':
      return 'object.container.person.composer'
    default:
      return ''
  }
}

/**
 * Creates object with uri and metadata from playback uri
 * @param  {String} uri The playback uri
 * @param  {String} artUri Uri for art image
 * @return {Object} { uri: uri, metadata: metadata }
 */
Helpers.GenerateLocalMetadata = function (uri, artUri = '') {
  var title = ''
  var match = /.*\/(.*)$/g.exec(uri.replace(/\.[a-zA-Z0-9]{3}$/, ''))
  if (match) {
    title = match[1]
  }
  var meta = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="##ITEMID##" parentID="##PARENTID##" restricted="true"><dc:title>##RESOURCETITLE##</dc:title><upnp:class>##UPNPCLASS##</upnp:class><upnp:albumArtURI>##ARTURI##</upnp:albumArtURI><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">##REGION##</desc></item></DIDL-Lite>'
  if (uri.startsWith('x-file-cifs')) {
    return {
      uri: uri,
      metadata: meta.replace('##ITEMID##', uri.replace('x-file-cifs', 'S').replace(/\s/g, '%20'))
        .replace('##RESOURCETITLE##', title.replace('%20', ' '))
        .replace('##UPNPCLASS##', Helpers.GetUpnpClass('A:TRACKS'))
        .replace('##PARENTID##', 'A:TRACKS')
        .replace('##ARTURI##', artUri.replace(/\s/g, '%20'))
        .replace('##REGION##', 'RINCON_AssociatedZPUDN')
    }
  }
  if (uri.startsWith('x-rincon-playlist')) {
    var parentMatch = /.*#(.*)\/.*/g.exec(uri)
    var parentID = parentMatch[1]

    return {
      uri: uri,
      metadata: meta.replace('##ITEMID##', `${parentID}/${title.replace(/\s/g, '%20')}`)
        .replace('##RESOURCETITLE##', title.replace('%20', ' '))
        .replace('##UPNPCLASS##', Helpers.GetUpnpClass(parentID))
        .replace('##PARENTID##', parentID)
        .replace('##ARTURI##', artUri.replace(/\s/g, '%20'))
        .replace('##REGION##', 'RINCON_AssociatedZPUDN')
    }
  }
  return { uri: uri, metadata: '' }
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
  if (!((parts.length === 2 && (parts[0] === 'radio' || parts[0] === 'x-sonosapi-stream' || parts[0] === 'x-rincon-cpcontainer')) || (parts.length >= 3 && parts[0] === 'spotify'))) {
    debug('Returning string because it isn\'t recognized')
    return Helpers.GenerateLocalMetadata(uri)
  }
  var meta = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="##SPOTIFYURI##" ##PARENTID##restricted="true"><dc:title>##RESOURCETITLE##</dc:title><upnp:class>##SPOTIFYTYPE##</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">##REGION##</desc></item></DIDL-Lite>'

  if (parts[0] === 'radio' || parts[0] === 'x-sonosapi-stream') {
    var radioTitle = title || 'TuneIn Radio'
    if (parts[0] === 'radio') {
      return {
        uri: 'x-sonosapi-stream:' + parts[1] + '?sid=254&flags=8224&sn=0',
        metadata: meta.replace('##SPOTIFYURI##', 'F00092020' + parts[1])
          .replace('##RESOURCETITLE##', Helpers.EncodeXml(radioTitle))
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
      uri: 'x-sonosapi-radio:' + spotifyUri + '?sid=12&flags=8300&sn=5',
      metadata: meta.replace('##SPOTIFYURI##', '100c206c' + spotifyUri)
        .replace('##RESOURCETITLE##', spotifyTitle)
        .replace('##SPOTIFYTYPE##', 'object.item.audioItem.audioBroadcast.#artistRadio')
        .replace('##PARENTID##', 'parentID="10052064' + parentId + '" ')
    }
  } else if (uri.startsWith('x-rincon-cpcontainer:1006206ccatalog')) { // Amazon prime container
    const [id] = uri.match(/^x-rincon-cpcontainer:(.*)\?.*/).splice(1)

    return {
      uri: String(uri).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
      metadata: meta.replace('##SPOTIFYURI##', id)
        .replace('##RESOURCETITLE##', title)
        .replace('##SPOTIFYTYPE##', 'object.container.playlistContainer')
        .replace('##PARENTID##', '')
    }
  } else if (uri.startsWith('x-rincon-cpcontainer:100d206cuser-fav')) { // Sound Cloud likes
    const id = uri.replace('x-rincon-cpcontainer:', '')
    return {
      uri: uri,
      metadata: meta.replace('##SPOTIFYURI##', id)
        .replace('##RESOURCETITLE##', title || 'Sound Cloud Likes')
        .replace('##SPOTIFYTYPE##', 'object.container.albumList')
        .replace('##PARENTID##', '')
        .replace(`SA_RINCON${region}_X_#Svc${region}-0-Token`, 'SA_RINCON40967_X_#Svc40967-0-Token')
    }
  } else if (uri.startsWith('x-rincon-cpcontainer:1006206cplaylist')) { // Sound Cloud playlists
    const [id] = uri.replace('x-rincon-cpcontainer:', '').split('?')
    return {
      uri: uri,
      metadata: meta.replace('##SPOTIFYURI##', id)
        .replace('##RESOURCETITLE##', title || 'Sound Cloud Playlist')
        .replace('##SPOTIFYTYPE##', 'object.container.playlistContainer')
        .replace('##PARENTID##', '')
        .replace(`SA_RINCON${region}_X_#Svc${region}-0-Token`, 'SA_RINCON40967_X_#Svc40967-0-Token')
    }
  } else {
    return { uri: uri, metadata: '' }
  }
}

/**
 * Parse DIDL into track structure
 * @param  {String} didl
 * @param  {String} host host ip
 * @param  {Number} port port numer
 * @return {object}
 */
Helpers.ParseDIDL = function (didl, host, port, trackUri) {
  debug('ParseDIDL %j %s %d', didl, host, port)
  if ((!didl) || (!didl['DIDL-Lite'])) return {}
  let item = didl['DIDL-Lite'].item
  return Helpers.ParseDIDLItem(item, host, port, trackUri)
}

Helpers.ParseDIDLItem = function (item, host, port, trackUri) {
  let albumArtURI = item['upnp:albumArtURI'] || null
  if (albumArtURI && Array.isArray(albumArtURI)) {
    albumArtURI = albumArtURI.length > 0 ? albumArtURI[0] : null
  }
  let track = {
    title: item['r:streamContent'] || item['dc:title'] || null,
    artist: item['dc:creator'] || null,
    album: item['upnp:album'] || null,
    albumArtURI
  }
  if (trackUri) track.uri = trackUri
  if (host && port && track.albumArtURI && !/^\bhttp[s]*:\/\//.test(track.albumArtURI)) {
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
  return parseString(input, { mergeAttrs: true, explicitArray: false }, callback)
}

const playbackStates = { 'STOPPED': 'stopped', 'PLAYING': 'playing', 'PAUSED_PLAYBACK': 'paused', 'TRANSITIONING': 'transitioning', 'NO_MEDIA_PRESENT': 'no_media' }
/**
 * Convert the playbackstate to a bit more readable
 * @param {String} state Sonos playback state
 */
Helpers.TranslateState = function (state) {
  return playbackStates[state] || state
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
