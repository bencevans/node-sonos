/**
 * Constants
 */
var TRANSPORT_ENDPOINT = '/MediaRenderer/AVTransport/Control'
var RENDERING_ENDPOINT = '/MediaRenderer/RenderingControl/Control'
var DEVICE_ENDPOINT = '/DeviceProperties/Control'

const TRANSPORT_EVENT = '/MediaRenderer/AVTransport/Event'
const RENDERING_EVENT = '/MediaRenderer/RenderingControl/Event'

/**
 * Dependencies
 */
var util = require('util')
var EventEmitter = require('events').EventEmitter
var dgram = require('dgram')
var request = require('request')
var xml2js = require('xml2js')
var debug = require('debug')('sonos')
var _ = require('underscore')
var Buffer = require('safe-buffer').Buffer

/**
 * Services
 */
var Services = {
  AlarmClock: require('./services/AlarmClock'),
  AudioIn: require('./services/AudioIn'),
  AVTransport: require('./services/AVTransport'),
  ContentDirectory: require('./services/ContentDirectory'),
  DeviceProperties: require('./services/DeviceProperties'),
  GroupManagement: require('./services/GroupManagement'),
  GroupRenderingControl: require('./services/GroupRenderingControl'),
  MusicServices: require('./services/MusicServices'),
  RenderingControl: require('./services/RenderingControl'),
  Service: require('./services/Service'),
  SystemProperties: require('./services/SystemProperties'),
  ZoneGroupTopology: require('./services/ZoneGroupTopology')
}

/**
 * Listener
 */
var Listener = require('./events/listener')

/**
 * Helpers
 */

/**
 * Wrap in UPnP Envelope
 * @param  {String} body
 * @return {String}
 */
var withinEnvelope = function (body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '<s:Body>' + body + '</s:Body>',
    '</s:Envelope>'].join('')
}

/**
 * Encodes characters not allowed within html/xml tags
 * @param  {String} str
 * @return {String}
 */
var htmlEntities = function (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Creates object with uri and metadata from Spotify track uri
 * @param  {String} uri
 * @return {Object} options       {uri: Spotify uri, metadata: metadata}
 */
var generateOptionsFromUri = function (uri, title, region) {
  var parts = uri.split(':')
  if (!((parts.length === 2 && parts[0] === 'radio') || (parts.length >= 3 && parts[0] === 'spotify'))) {
    debug('Returning string because it isn\'t recognized')
    return uri
  }
  var meta = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="##SPOTIFYURI##" ##PARENTID##restricted="true"><dc:title>##RESOURCETITLE##</dc:title><upnp:class>##SPOTIFYTYPE##</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">##REGION##</desc></item></DIDL-Lite>'

  if (parts[0] === 'radio') {
    var radioTitle = title || 'TuneIn Radio'
    return {
      uri: 'x-sonosapi-stream:s' + parts[1] + '?sid=254&flags=8224&sn=0',
      metadata: meta.replace('##SPOTIFYURI##', 'F00092020s' + parts[1])
        .replace('##RESOURCETITLE##', radioTitle)
        .replace('##SPOTIFYTYPE##', 'object.item.audioItem.audioBroadcast')
        .replace('##PARENTID##', 'parentID="L" ')
        .replace('##REGION##', 'SA_RINCON65031_')
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
    return uri
  }
}

var SpotifyRegion = {
  EU: '2311',
  US: '3079'
}

/**
 * Sonos "Class"
 * @param {String} host IP/DNS
 * @param {Number} port
 */
var Sonos = function Sonos (host, port, options) {
  this.host = host
  this.port = port || 1400
  this.options = options || {}
  if (!this.options.endpoints) this.options.endpoints = {}
  if (!this.options.endpoints.transport) this.options.endpoints.transport = TRANSPORT_ENDPOINT
  if (!this.options.endpoints.rendering) this.options.endpoints.rendering = RENDERING_ENDPOINT
  if (!this.options.endpoints.device) this.options.endpoints.device = DEVICE_ENDPOINT

  this.options.spotify = this.options.spotify || {}
  this.options.spotify.region = this.options.spotify.region || SpotifyRegion.US

  // Attach to newListener event
  var self = this
  var implicitListen = function (event, listener) {
    if (event === 'newListener') return
    self.removeListener('newListener', implicitListen)
    if (!self.eventListener) {
      self.startListening(null, function (err, success) {
        if (err) {
          debug('Error implicitly started listening %j', err)
        }
        if (success) {
          debug('Started listening implicitly')
        }
      })
    }
  }
  this.on('newListener', implicitListen)
  // Maybe stop the eventListener once last listener is removed?
}

// Make Sonos an EventEmitter
util.inherits(Sonos, EventEmitter)

/**
 * UPnP HTTP Request
 * @param  {String}   endpoint    HTTP Path
 * @param  {String}   action      UPnP Call/Function/Action
 * @param  {String}   body
 * @param  {String}   responseTag Expected Response Container XML Tag
 * @param  {Function} callback    (err, data)
 */
Sonos.prototype.request = function (endpoint, action, body, responseTag, callback) {
  debug('Sonos.request(%j, %j, %j, %j, %j)', endpoint, action, body, responseTag, callback)
  request({
    uri: 'http://' + this.host + ':' + this.port + endpoint,
    method: 'POST',
    headers: {
      'SOAPAction': action,
      'Content-type': 'text/xml; charset=utf8'
    },
    body: withinEnvelope(body)
  }, function (err, res, body) {
    if (err) return callback(err)
    if (res.statusCode !== 200) {
      return callback(new Error('HTTP response code ' + res.statusCode + ' for ' + action))
    }
    (new xml2js.Parser()).parseString(body, function (err, json) {
      if (err) return callback(err)
      if ((!json) || (!json['s:Envelope']) || (!Array.isArray(json['s:Envelope']['s:Body']))) {
        return callback(new Error('Invalid response for ' + action + ': ' + JSON.stringify(json)))
      }
      if (typeof json['s:Envelope']['s:Body'][0]['s:Fault'] !== 'undefined') {
        return callback(json['s:Envelope']['s:Body'][0]['s:Fault'])
      }
      return callback(null, json['s:Envelope']['s:Body'][0][responseTag])
    })
  })
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getMusicLibrary = function (searchType, options, callback) {
  this.searchMusicLibrary(searchType, null, options, callback)
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {String}   searchTerm  Optional - search term to search for
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.searchMusicLibrary = function (searchType, searchTerm, options, callback) {
  var self = this
  var searches = {
    'artists': 'A:ARTIST',
    'albumArtists': 'A:ALBUMARTIST',
    'albums': 'A:ALBUM',
    'genres': 'A:GENRE',
    'composers': 'A:COMPOSER',
    'tracks': 'A:TRACKS',
    'playlists': 'A:PLAYLISTS',
    'sonos_playlists': 'SQ:',
    'share': 'S:'
  }
  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: ''
  }
  searches = searches[searchType]

  var opensearch = (!searchTerm) || (searchTerm === '')
  if (!opensearch) searches = searches.concat(':' + searchTerm)

  var opts = {
    ObjectID: searches
  }
  if (options.start !== undefined) opts.StartingIndex = options.start
  if (options.total !== undefined) opts.RequestedCount = options.total
  opts = _.extend(defaultOptions, opts)
  var contentDirectory = new Services.ContentDirectory(this.host, this.port)
  return contentDirectory.Browse(opts, function (err, data) {
    if (err) return callback(err)
    return (new xml2js.Parser()).parseString(data.Result, function (err, didl) {
      if (err) return callback(err, data)
      var items = []
      if ((!didl) || (!didl['DIDL-Lite'])) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      var resultcontainer = opensearch ? didl['DIDL-Lite'].container : didl['DIDL-Lite'].item
      if (!Array.isArray(resultcontainer)) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      _.each(resultcontainer, function (item) {
        var albumArtURL = null
        if (Array.isArray(item['upnp:albumArtURI'])) {
          if (item['upnp:albumArtURI'][0].indexOf('http') !== -1) {
            albumArtURL = item['upnp:albumArtURI'][0]
          } else {
            albumArtURL = 'http://' + self.host + ':' + self.port + item['upnp:albumArtURI'][0]
          }
        }
        items.push({
          'title': Array.isArray(item['dc:title']) ? item['dc:title'][0] : null,
          'artist': Array.isArray(item['dc:creator']) ? item['dc:creator'][0] : null,
          'albumArtURL': albumArtURL,
          'album': Array.isArray(item['upnp:album']) ? item['upnp:album'][0] : null,
          'uri': Array.isArray(item.res) ? item.res[0]._ : null
        })
      })
      var result = {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      }
      return callback(null, result)
    })
  })
}

/**
 * Get Sonos Favorites
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavorites = function (callback) {
  var self = this
  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: ''
  }

  var opts = {
    ObjectID: 'FV:2'
  }

  opts = _.extend(defaultOptions, opts)
  var contentDirectory = new Services.ContentDirectory(this.host, this.port)
  return contentDirectory.Browse(opts, function (err, data) {
    if (err) return callback(err)
    return (new xml2js.Parser()).parseString(data.Result, function (err, didl) {
      if (err) return callback(err, data)
      var items = []
      if ((!didl) || (!didl['DIDL-Lite'])) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }

      var resultcontainer = didl['DIDL-Lite'].item
      if (!Array.isArray(resultcontainer)) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      _.each(resultcontainer, function (item) {
        var albumArtURL = null
        if (Array.isArray(item['upnp:albumArtURI'])) {
          if (item['upnp:albumArtURI'][0].indexOf('http') !== -1) {
            albumArtURL = item['upnp:albumArtURI'][0]
          } else {
            albumArtURL = 'http://' + self.host + ':' + self.port + item['upnp:albumArtURI'][0]
          }
        }
        items.push({
          'title': Array.isArray(item['dc:title']) ? item['dc:title'][0] : null,
          'artist': Array.isArray(item['dc:creator']) ? item['dc:creator'][0] : null,
          'albumArtURL': albumArtURL,
          'album': Array.isArray(item['upnp:album']) ? item['upnp:album'][0] : null,
          'uri': Array.isArray(item.res) ? item.res[0]._ : null
        })
      })
      var result = {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      }
      return callback(null, result)
    })
  })
}

/**
 * Get Current Track
 * @param  {Function} callback (err, track)
 */
Sonos.prototype.currentTrack = function (callback) {
  debug('Sonos.currentTrack(' + ((callback) ? 'callback' : '') + ')')
  var self = this
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"'
  var body = '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>'
  var responseTag = 'u:GetPositionInfoResponse'
  return this.request(this.options.endpoints.transport, action, body, responseTag, function (err, data) {
    if (err) return callback(err)
    if ((!Array.isArray(data)) || (data.length < 1)) return {}
    var metadata = data[0].TrackMetaData
    var position = (parseInt(data[0].RelTime[0].split(':')[0], 10) * 60 * 60) +
      (parseInt(data[0].RelTime[0].split(':')[1], 10) * 60) +
      parseInt(data[0].RelTime[0].split(':')[2], 10)
    var duration = (parseInt(data[0].TrackDuration[0].split(':')[0], 10) * 60 * 60) +
      (parseInt(data[0].TrackDuration[0].split(':')[1], 10) * 60) +
      parseInt(data[0].TrackDuration[0].split(':')[2], 10)
    var trackUri = data[0].TrackURI ? data[0].TrackURI[0] : null
    var queuePosition = parseInt(data[0].Track[0])
    if ((metadata) && (metadata[0].length > 0) && metadata[0] !== 'NOT_IMPLEMENTED') {
      return (new xml2js.Parser()).parseString(metadata, function (err, data) {
        if (err) {
          return callback(err, data)
        }
        var track = self.parseDIDL(data)
        track.position = position
        track.duration = duration
        track.albumArtURL = !track.albumArtURI ? null
          : track.albumArtURI.startsWith('http') ? track.albumArtURI
            : 'http://' + self.host + ':' + self.port + track.albumArtURI
        if (trackUri) track.uri = trackUri
        track.queuePosition = queuePosition
        return callback(null, track)
      })
    } else {
      var track = { position: position, duration: duration, queuePosition: queuePosition }
      if (data[0].TrackURI) track.uri = data[0].TrackURI[0]
      return callback(null, track)
    }
  })
}

/**
 * Parse DIDL into track structure
 * @param  {String} didl
 * @return {object}
 */
Sonos.prototype.parseDIDL = function (didl) {
  if ((!didl) || (!didl['DIDL-Lite']) || (!Array.isArray(didl['DIDL-Lite'].item)) || (!didl['DIDL-Lite'].item[0])) return {}
  var item = didl['DIDL-Lite'].item[0]
  return {
    title: Array.isArray(item['dc:title']) ? item['dc:title'][0] : null,
    artist: Array.isArray(item['dc:creator']) ? item['dc:creator'][0] : null,
    album: Array.isArray(item['upnp:album']) ? item['upnp:album'][0] : null,
    albumArtURI: Array.isArray(item['upnp:albumArtURI']) ? item['upnp:albumArtURI'][0] : null
  }
}

/**
 * Get Current Volume
 * @param  {Function} callback (err, volume)
 */
Sonos.prototype.getVolume = function (callback) {
  debug('Sonos.getVolume(' + ((callback) ? 'callback' : '') + ')')
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"'
  var body = '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>'
  var responseTag = 'u:GetVolumeResponse'
  return this.request(this.options.endpoints.rendering, action, body, responseTag, function (err, data) {
    if (err) return callback(err)
    callback(null, parseInt(data[0].CurrentVolume[0], 10))
  })
}

/**
 * Get Current Muted
 * @param  {Function} callback (err, muted)
 */
Sonos.prototype.getMuted = function (callback) {
  debug('Sonos.getMuted(' + ((callback) ? 'callback' : '') + ')')
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"'
  var body = '<u:GetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>'
  var responseTag = 'u:GetMuteResponse'
  return this.request(this.options.endpoints.rendering, action, body, responseTag, function (err, data) {
    if (err) return callback(err)
    callback(null, !!parseInt(data[0].CurrentMute[0], 10))
  })
}

/**
 * Resumes Queue or Plays Provided URI
 * @param  {String|Object}   uri      Optional - URI to a Audio Stream or Object with play options
 * @param  {Function} callback (err, playing)
 */
Sonos.prototype.play = function (uri, callback) {
  debug('Sonos.play(%j, %j)', uri, callback)
  var action
  var body
  var self = this
  // Find the callback function since the uri is optional
  var cb = (typeof uri === 'function' ? uri : callback) || function () {}

  // If the Uri is a string try to generate metadata from it
  if (typeof uri === 'string') uri = generateOptionsFromUri(uri, undefined, this.options.spotify.region)

  // Copy the options if it is an object or create an object with uri property
  var options = (typeof uri === 'object'
    ? uri
    : {uri: (typeof uri === 'string' ? uri : undefined)}
  )
  if (options.uri) { // If we have an uri, this is the address of the new song
    return this.queue(options, function (err, queueResult) {
      if (err || !queueResult || queueResult.length < 0 || !queueResult[0].FirstTrackNumberEnqueued) {
        return cb(err)
      }
      var selectTrackNum = queueResult[0].FirstTrackNumberEnqueued[0]
      self.selectTrack(selectTrackNum, function (err) {
        if (err) return cb(err)
        return self.play(cb)
      })
    })
  } else { // No uri means continue playing
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"'
    body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>'
    return this.request(this.options.endpoints.transport, action, body, 'u:PlayResponse', function (err, data) {
      if (err) return cb(err)
      if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
        return cb(null, true)
      } else {
        return cb(new Error({
          err: err,
          data: data
        }), false)
      }
    })
  }
}

/**
 * Plays a uri directly (the queue stays the same)
 * @param  {String|Object}   uri      Optional - URI to a Audio Stream or Object with play options
 * @param  {Function} callback (err, playing)
 */
Sonos.prototype.playWithoutQueue = function (uri, callback) {
  debug('Sonos.playWithoutQueue(%j, %j)', uri, callback)
  var self = this

  if (typeof uri !== 'string' && typeof uri !== 'object') {
    callback(new Error('The uri sould be a string or an object!'))
  }

  // If the Uri is a string try to generate metadata from it
  if (typeof uri === 'string') uri = generateOptionsFromUri(uri, undefined, this.options.spotify.region)

  // Copy the options if it is an object or create an object with uri property
  var options = (typeof uri === 'object'
    ? uri
    : {uri: (typeof uri === 'string' ? uri : undefined)}
  )
  if (options.uri) {
    var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"'
    var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + htmlEntities(options.uri) + '</CurrentURI><CurrentURIMetaData>' + htmlEntities(options.metadata) + '</CurrentURIMetaData></u:SetAVTransportURI>'
    return this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse', function (err, data) {
      if (err) return callback(err)
      if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
        return self.play(callback)
      } else {
        return callback(new Error({
          err: err,
          data: data
        }), false)
      }
    })
  }
}

/**
 * Stop What's Playing
 * @param  {Function} callback (err, stopped)
 */
Sonos.prototype.stop = function (callback) {
  debug('Sonos.stop(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Stop"'
  body = '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>'
  return this.request(this.options.endpoints.transport, action, body, 'u:StopResponse', function (err, data) {
    if (err) return callback(err)
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Become Coordinator of Standalone Group
 * @param  {Function} callback (err, stopped)
 */
Sonos.prototype.becomeCoordinatorOfStandaloneGroup = function (callback) {
  debug('Sonos.becomeCoordinatorOfStandaloneGroup(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#BecomeCoordinatorOfStandaloneGroup"'
  body = '<u:BecomeCoordinatorOfStandaloneGroup xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:BecomeCoordinatorOfStandaloneGroup>'
  return this.request(this.options.endpoints.transport, action, body, 'u:BecomeCoordinatorOfStandaloneGroupResponse', function (err, data) {
    if (err) return callback(err)
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Pause Current Queue
 * @param  {Function} callback (err, paused)
 */
Sonos.prototype.pause = function (callback) {
  debug('Sonos.pause(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"'
  body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>'
  return this.request(this.options.endpoints.transport, action, body, 'u:PauseResponse', function (err, data) {
    if (err) return callback(err)
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Seek the current track
 * @param  {Function} callback (err, seeked)
 */
Sonos.prototype.seek = function (seconds, callback) {
  debug('Sonos.seek(%j)', callback)
  var action, body, hh, mm, ss
  hh = Math.floor(seconds / 3600)
  mm = Math.floor((seconds - (hh * 3600)) / 60)
  ss = seconds - ((hh * 3600) + (mm * 60))
  if (hh < 10) hh = '0' + hh
  if (mm < 10) mm = '0' + mm
  if (ss < 10) ss = '0' + ss
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"'
  body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>REL_TIME</Unit><Target>' + hh + ':' + mm + ':' + ss + '</Target></u:Seek>'
  return this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse', function (err, data) {
    if (err) return callback(err)
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Select specific track in queue
 * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
 * @param  {Function} callback (err, data)
 */
Sonos.prototype.selectTrack = function (trackNr, callback) {
  if (typeof trackNr === 'function') {
    callback = trackNr
    trackNr = 1
  }
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"'
  var body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>' + trackNr + '</Target></u:Seek>'
  return this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse', function (err, data) {
    if (err) return callback(err)
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Play next in queue
 * @param  {Function} callback (err, movedToNext)
 */
Sonos.prototype.next = function (callback) {
  debug('Sonos.next(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Next"'
  body = '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>'
  this.request(this.options.endpoints.transport, action, body, 'u:NextResponse', function (err, data) {
    if (err) {
      return callback(err)
    }
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Play previous in queue
 * @param  {Function} callback (err, movedToPrevious)
 */
Sonos.prototype.previous = function (callback) {
  debug('Sonos.previous(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Previous"'
  body = '<u:Previous xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Previous>'
  this.request(this.options.endpoints.transport, action, body, 'u:PreviousResponse', function (err, data) {
    if (err) {
      return callback(err)
    }
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true)
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false)
    }
  })
}

/**
 * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
 * @param  {Function}  callback (err, data)  Optional
 */
Sonos.prototype.selectQueue = function (callback) {
  debug('Sonos.selectQueue(%j)', callback)
  var cb = callback || function () {}
  var self = this
  self.getZoneInfo(function (err, data) {
    if (!err) {
      var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"'
      var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + 'x-rincon-queue:RINCON_' + data.MACAddress.replace(/:/g, '') + '0' + self.port + '#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>'
      self.request(self.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse', function (err, data) {
        if (err) return cb(err)
        if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
          return cb(null, true)
        } else {
          return cb(new Error({
            err: err,
            data: data
          }), false)
        }
      })
    } else {
      return cb(err)
    }
  })
}

/**
 * Plays tunein based on radio station id
 * @param  {String}   stationId  tunein radio station id
 * @param  {Function} callback (err, playing)
 */
Sonos.prototype.playTuneinRadio = function (stationId, stationTitle, callback) {
  debug('Sonos.playTuneinRadio(%j, %j, %j)', stationId, stationTitle, callback)
  if (!stationId || !stationTitle) {
    return callback(new Error('stationId and stationTitle are required'))
  }
  var options = generateOptionsFromUri('radio:' + stationId, stationTitle)
  return this.playWithoutQueue(options, callback)
}

/**
 * Plays Spotify radio based on artist uri
 * @param  {String}   artistId  Spotify artist id
 * @param  {Function} callback (err, playing)
 */
Sonos.prototype.playSpotifyRadio = function (artistId, artistName, callback) {
  debug('Sonos.playSpotifyRadio(%j, %j, %j)', artistId, artistName, callback)
  if (!artistId || !artistName) {
    return callback(new Error('artistId and artistName are required'))
  }
  var options = generateOptionsFromUri('spotify:artistRadio:' + artistId, artistName, this.options.spotify.region)
  return this.playWithoutQueue(options, callback)
}

/**
 * Queue a Song Next
 * @param  {String|Object}   uri      URI to Audio Stream or Object containing options (uri, metadata)
 * @param  {Function} callback (err, queued)
 */
Sonos.prototype.queueNext = function (uri, callback) {
  debug('Sonos.queueNext(%j, %j)', uri, callback)
  if (typeof uri === 'string') uri = generateOptionsFromUri(uri, undefined, this.options.spotify.region)
  var options = (typeof uri === 'object' ? uri : { metadata: '' })
  if (typeof uri === 'object') {
    options.metadata = uri.metadata || ''
    options.metadata = htmlEntities(options.metadata)
    options.uri = uri.uri
  } else {
    options.uri = uri
  }
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"'
  var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + options.uri + '</CurrentURI><CurrentURIMetaData>' + options.metadata + '</CurrentURIMetaData></u:SetAVTransportURI>'
  this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse', function (err, data) {
    if (callback) {
      return callback(err, data)
    } else {
      return null
    }
  })
}

/**
 * Add a song to the queue.
 * @param  {String}   uri             URI to Audio Stream
 * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
 *                                    defaults to end of queue, 0 to explicitly set end of queue)
 * @param  {Function} callback (err, queued)
 */
Sonos.prototype.queue = function (uri, positionInQueue, callback) {
  debug('Sonos.queue(%j, %j, %j)', uri, positionInQueue, callback)
  if (typeof positionInQueue === 'function') {
    callback = positionInQueue
    positionInQueue = 0
  }
  if (typeof uri === 'string') uri = generateOptionsFromUri(uri, undefined, this.options.spotify.region)
  var options = (typeof uri === 'object' ? uri : { metadata: '' })
  if (typeof uri === 'object') {
    options.metadata = uri.metadata || ''
    options.metadata = htmlEntities(options.metadata)
    options.uri = uri.uri
  } else {
    options.uri = uri
  }
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"'
  var body = '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>' + htmlEntities(options.uri) + '</EnqueuedURI><EnqueuedURIMetaData>' + options.metadata + '</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>' + positionInQueue + '</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>'
  this.request(this.options.endpoints.transport, action, body, 'u:AddURIToQueueResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Flush queue
 * @param  {Function} callback (err, flushed)
 */
Sonos.prototype.flush = function (callback) {
  debug('Sonos.flush(%j)', callback)
  var action, body
  action = '"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"'
  body = '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>'
  this.request(this.options.endpoints.transport, action, body, 'u:RemoveAllTracksFromQueueResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Get the LED State
 * @param  {Function} callback (err, state) state is a string, "On" or "Off"
 */
Sonos.prototype.getLEDState = function (callback) {
  debug('Sonos.getLEDState(%j)', callback)
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"'
  var body = '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>'
  this.request(this.options.endpoints.device, action, body, 'u:GetLEDStateResponse', function (err, data) {
    if (err) return callback(err, data)
    if (data[0] && data[0].CurrentLEDState && data[0].CurrentLEDState[0]) {
      return callback(null, data[0].CurrentLEDState[0])
    }
    callback(new Error('unknown response'))
  })
}

/**
 * Set the LED State
 * @param  {String}   desiredState           "On"/"Off"
 * @param  {Function} callback (err)
 */
Sonos.prototype.setLEDState = function (desiredState, callback) {
  debug('Sonos.setLEDState(%j, %j)', desiredState, callback)
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetLEDState"'
  var body = '<u:SetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredLEDState>' + desiredState + '</DesiredLEDState></u:SetLEDState>'
  this.request(this.options.endpoints.device, action, body, 'u:SetLEDStateResponse', function (err) {
    return callback(err)
  })
}

/**
 * Get Zone Info
 * @param  {Function} callback (err, info)
 */
Sonos.prototype.getZoneInfo = function (callback) {
  debug('Sonos.getZoneInfo(%j)', callback)
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"'
  var body = '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>'
  this.request(this.options.endpoints.device, action, body, 'u:GetZoneInfoResponse', function (err, data) {
    if (err) return callback(err, data)
    var output = {}
    for (var d in data[0]) if (data[0].hasOwnProperty(d) && d !== '$') output[d] = data[0][d][0]
    callback(null, output)
  })
}

/**
 * Get Zone Attributes
 * @param  {Function} callback (err, data)
 */
Sonos.prototype.getZoneAttrs = function (callback) {
  debug('Sonos.getZoneAttrs(%j, %j)', callback)
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"'
  var body = '"<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>"'
  this.request(this.options.endpoints.device, action, body, 'u:GetZoneAttributesResponse', function (err, data) {
    if (err) return callback(err, data)
    var output = {}
    for (var d in data[0]) if (data[0].hasOwnProperty(d) && d !== '$') output[d] = data[0][d][0]
    callback(null, output)
  })
}

/**
 * Get Information provided by /xml/device_description.xml
 * @param  {Function} callback (err, info)
 */
Sonos.prototype.deviceDescription = function (callback) {
  request({
    uri: 'http://' + this.host + ':' + this.port + '/xml/device_description.xml'
  }, function (err, res, body) {
    if (err) return callback(err)
    if (res.statusCode !== 200) {
      return callback(new Error('non 200 errorCode'))
    }
    (new xml2js.Parser()).parseString(body, function (err, json) {
      if (err) return callback(err)
      var output = {}
      for (var d in json.root.device[0]) if (json.root.device[0].hasOwnProperty(d)) output[d] = json.root.device[0][d][0]
      callback(null, output)
    })
  })
}

/**
 * Set Name
 * @param  {String}   name
 * @param  {Function} callback (err, data)
 */
Sonos.prototype.setName = function (name, callback) {
  debug('Sonos.setName(%j, %j)', name, callback)
  name = name.replace(/[<&]/g, function (str) { return (str === '&') ? '&amp;' : '&lt;' })
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetZoneAttributes"'
  var body = '"<u:SetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredZoneName>' + name + '</DesiredZoneName><DesiredIcon /><DesiredConfiguration /></u:SetZoneAttributes>"'
  this.request(this.options.endpoints.device, action, body, 'u:SetZoneAttributesResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Get Play Mode
 * @param  {String} playmode
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.getPlayMode = function (callback) {
  debug('Sonos.getPlayMode(%j)', callback)
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportSettings"'
  var body = '<u:GetTransportSettings xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportSettings>'
  this.request(this.options.endpoints.transport, action, body, 'u:GetTransportSettingsResponse', function (err, data) {
    return callback(err, data[0].PlayMode[0])
  })
}

/**
 * Set Play Mode
 * @param  {String} playmode
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setPlayMode = function (playmode, callback) {
  debug('Sonos.setPlayMode(%j, %j)', playmode, callback)
  var mode = { NORMAL: true, REPEAT_ALL: true, SHUFFLE: true, SHUFFLE_NOREPEAT: true }[playmode.toUpperCase()]
  if (!mode) return callback(new Error('invalid play mode ' + playmode))
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetPlayMode"'
  var body = '<u:SetPlayMode xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewPlayMode>' + playmode.toUpperCase() + '</NewPlayMode></u:SetPlayMode>'
  this.request(this.options.endpoints.transport, action, body, 'u:SetPlayModeResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Set Volume
 * @param  {String}   volume 0..100
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setVolume = function (volume, callback) {
  debug('Sonos.setVolume(%j, %j)', volume, callback)
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"'
  var body = '<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>' + volume + '</DesiredVolume></u:SetVolume>'
  this.request(this.options.endpoints.rendering, action, body, 'u:SetVolumeResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Configure Sleep Timer
 * @param  {String} sleepTimerDuration
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.configureSleepTimer = function (sleepTimerDuration, callback) {
  debug('Sonos.sleepTimerDuration(%j, %j)', sleepTimerDuration, callback)
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#ConfigureSleepTimer"'
  var body = '<u:ConfigureSleepTimer xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewSleepTimerDuration>' + sleepTimerDuration + '</NewSleepTimerDuration></u:ConfigureSleepTimer>'
  return this.request(this.options.endpoints.transport, action, body, 'u:ConfigureSleepTimerResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Set Muted
 * @param  {Boolean}  muted
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setMuted = function (muted, callback) {
  debug('Sonos.setMuted(%j, %j)', muted, callback)
  if (typeof muted === 'string') muted = !!parseInt(muted, 10)
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetMute"'
  var body = '<u:SetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>' + (muted ? '1' : '0') + '</DesiredMute></u:SetMute>'
  this.request(this.options.endpoints.rendering, action, body, 'u:SetMutedResponse', function (err, data) {
    return callback(err, data)
  })
}

/**
 * Get Zones in contact with current Zone with Group Data
 * @param  {Function} callback (err, topology)
 */
Sonos.prototype.getTopology = function (callback) {
  debug('Sonos.getTopology(%j)', callback)
  request('http://' + this.host + ':' + this.port + '/status/topology', function (err, res, body) {
    if (err) return callback(err)
    debug(body)
    xml2js.parseString(body, function (err, topology) {
      if (err) return callback(err)
      var info = topology.ZPSupportInfo
      var zones = null
      var mediaServers = null
      if (info.ZonePlayers && info.ZonePlayers.length > 0) {
        zones = _.map(info.ZonePlayers[0].ZonePlayer, function (zone) {
          return _.extend(zone.$, {name: zone._})
        })
      }
      if (info.MediaServers && info.MediaServers.length > 0) {
        mediaServers = _.map(info.MediaServers[0].MediaServer, function (zone) {
          return _.extend(zone.$, {name: zone._})
        })
      }
      callback(null, {
        zones: zones,
        mediaServers: mediaServers
      })
    })
  })
}
/**
 * Get Current Playback State
 * @param  {Function} callback (err, state)
 */
Sonos.prototype.getCurrentState = function (callback) {
  debug('Sonos.currentState(%j)', callback)
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"'
  var body = '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>'
  var state = null
  return this.request(this.options.endpoints.transport, action, body, 'u:GetTransportInfoResponse', function (err, data) {
    if (err) {
      callback(err)
      return
    }
    if (JSON.stringify(data[0].CurrentTransportState) === '["STOPPED"]') {
      state = 'stopped'
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["PLAYING"]') {
      state = 'playing'
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["PAUSED_PLAYBACK"]') {
      state = 'paused'
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["TRANSITIONING"]') {
      state = 'transitioning'
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["NO_MEDIA_PRESENT"]') {
      state = 'no_media'
    }
    return callback(err, state)
  })
}
/**
 * Get Favorites Radio Stations
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadioStations = function (options, callback) {
  this.getFavoritesRadio('stations', options, callback)
}
/**
 * Get Favorites Radio Shows
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadioShows = function (options, callback) {
  this.getFavoritesRadio('shows', options, callback)
}
/**
 * Get Favorites Radio for a given radio type
 * @param  {String}   favoriteRadioType  Choice - stations, shows
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadio = function (favoriteRadioType, options, callback) {
  var radioTypes = {
    'stations': 'R:0/0',
    'shows': 'R:0/1'
  }
  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: '',
    ObjectID: 'R:0/0'
  }
  var opts = {
    ObjectID: radioTypes[favoriteRadioType]
  }
  if (options.start !== undefined) opts.StartingIndex = options.start
  if (options.total !== undefined) opts.RequestedCount = options.total
  opts = _.extend(defaultOptions, opts)
  var contentDirectory = new Services.ContentDirectory(this.host, this.port)
  return contentDirectory.Browse(opts, function (err, data) {
    if (err) return callback(err)
    return (new xml2js.Parser()).parseString(data.Result, function (err, didl) {
      if (err) return callback(err, data)
      var items = []
      if ((!didl) || (!didl['DIDL-Lite'])) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      var resultcontainer = didl['DIDL-Lite'].item
      if (!Array.isArray(resultcontainer)) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      _.each(resultcontainer, function (item) {
        items.push({
          'title': Array.isArray(item['dc:title']) ? item['dc:title'][0] : null,
          'uri': Array.isArray(item.res) ? item.res[0]._ : null
        })
      })
      var result = {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      }
      return callback(null, result)
    })
  })
}

Sonos.prototype.setSpotifyRegion = function (region) {
  this.options.spotify.region = region
}

// Get queue

Sonos.prototype.getQueue = function (callback) {
  var self = this

  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '1000',
    SortCriteria: ''
  }

  var opts = {
    ObjectID: 'Q:0'
  }

  opts = _.extend(defaultOptions, opts)

  var contentDirectory = new Services.ContentDirectory(this.host, this.port)
  return contentDirectory.Browse(opts, function (err, data) {
    if (err) return callback(err)
    return (new xml2js.Parser()).parseString(data.Result, function (err, didl) {
      if (err) return callback(err, data)
      var items = []
      if ((!didl) || (!didl['DIDL-Lite'])) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      var resultcontainer = didl['DIDL-Lite'].item
      if (!Array.isArray(resultcontainer)) {
        return callback(new Error('Cannot parse DIDTL result'), data)
      }
      _.each(resultcontainer, function (item) {
        var albumArtURL = null
        if (Array.isArray(item['upnp:albumArtURI'])) {
          if (item['upnp:albumArtURI'][0].indexOf('http') !== -1) {
            albumArtURL = item['upnp:albumArtURI'][0]
          } else {
            albumArtURL = 'http://' + self.host + ':' + self.port + item['upnp:albumArtURI'][0]
          }
        }
        items.push({
          'title': Array.isArray(item['dc:title']) ? item['dc:title'][0] : null,
          'artist': Array.isArray(item['dc:creator']) ? item['dc:creator'][0] : null,
          'albumArtURL': albumArtURL,
          'album': Array.isArray(item['upnp:album']) ? item['upnp:album'][0] : null,
          'uri': Array.isArray(item.res) ? item.res[0]._ : null
        })
      })
      var result = {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      }
      return callback(null, result)
    })
  })
}

// ----------------------------- EventEmitter part

// Some Constants
const EVENT_TRAKCHANGED = 'TrackChanged'
const EVENT_STATECHANGED = 'StateChanged'
const EVENT_VOLUMECHANGED = 'VolumeChanged'
const EVENT_MUTED = 'Muted'

/**
 * Create a socket and start listening for Events from Sonos
 * @param  {Object}   options     As defined in https://github.com/bencevans/node-sonos/blob/master/lib/events/listener.js
 * @param  {Function} callback (err) result - string
 * */
Sonos.prototype.startListening = function (options, callback) {
  var self = this
  debug('Sonos.startListening(%j,%j)', options, callback)
  if (this.eventListener != null) {
    throw new Error('Already listening')
  }
  // Lets create a listener and start listening
  self.eventListener = new Listener(self, options)
  self.eventListener.listen(function (err) {
    if (err) {
      callback(err)
      return
    }

    // Listen for events and parse them
    self.eventListener.on('serviceEvent', function (endpoint, sid, data) {
      debug('Sonos serviceEvent (%j,%j)', endpoint, sid)
      switch (endpoint) {
        case TRANSPORT_EVENT: // This events triggers on State and Track change
          // Get and emit state on changes
          self.getCurrentState(function (err2, state) {
            if (err2) {
              debug('Error loading state %j', err2)
              return
            }
            if (state !== self.lastState) {
              self.lastState = state
              self.emit(EVENT_STATECHANGED, state)
              debug('Emit state changed to %j', state)
            }
          })

          self.currentTrack(function (err2, track) {
            if (err2) {
              debug('Error loading track %j', err2)
            }
            // TODO Check if it is a different track like state
            self.emit(EVENT_TRAKCHANGED, track)
            debug('Current Track changed to %j', track)
          })

          // self.currentTrack()
          break
        case RENDERING_EVENT: // This event triggers on volume and mute change
          self.getVolume(function (err2, volume) {
            if (err2) {
              debug('Error loading volume %j', err2)
              return
            }
            if (self.lastVolume !== volume) {
              self.lastVolume = volume
              self.emit(EVENT_VOLUMECHANGED, volume)
              debug('Emit volume changed to %j', volume)
            }
          })
          self.getMuted(function (err2, muted) {
            if (err2) {
              debug('Error getting muted %j', err2)
              return
            }
            if (self.isMuted !== muted) {
              self.isMuted = muted
              self.emit(EVENT_MUTED, muted)
              debug('Emit muted to %j', muted)
            }
          })
          break

        default:
          debug('Received unexpected event %s from %s', endpoint, self.host)
          break
      }
    })

    // Subscribe to transport events
    self.eventListener.addService(TRANSPORT_EVENT, function (error, sid) {
      if (error) {
        // Now what??
        return
      }
      debug('Subscribed for %j', TRANSPORT_EVENT)
    })

    // Subscribe to rendering events
    self.eventListener.addService(RENDERING_EVENT, function (error, sid) {
      if (error) {
        // Now what??
        return
      }
      debug('Subscribed for %j', RENDERING_EVENT)
    })
    callback(null, true)
  })
}

Sonos.prototype.stopListening = function (callback) {
  if (!this.eventListener) {
    throw new Error('Not listening')
  }
  this.eventListener.stop(function (err, success) {
    callback(err, success)
  })
}

// ----------------------------- End EventEmitter part

/**
 * Search "Class"
 * Emits 'DeviceAvailable' on a Sonos Component Discovery
 */
var Search = function Search (options) {
  var self = this
  self.foundSonosDevices = {}
  self.onTimeout = function () {
    clearTimeout(self.pollTimer)
  }
  var PLAYER_SEARCH = new Buffer(['M-SEARCH * HTTP/1.1',
    'HOST: 239.255.255.250:1900',
    'MAN: ssdp:discover',
    'MX: 1',
    'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'))
  var sendDiscover = function () {
    ['239.255.255.250', '255.255.255.255'].map(function (addr) {
      self.socket.send(PLAYER_SEARCH, 0, PLAYER_SEARCH.length, 1900, addr)
    })
    // Periodically send discover packet to find newly added devices
    self.pollTimer = setTimeout(sendDiscover, 10000)
    // Remove the on timeout listener and add back in every iteration
    self.removeListener('timeout', self.onTimeout)
    self.on('timeout', self.onTimeout)
  }
  this.socket = dgram.createSocket('udp4', function (buffer, rinfo) {
    buffer = buffer.toString()
    if (buffer.match(/.+Sonos.+/)) {
      var modelCheck = buffer.match(/SERVER.*\((.*)\)/)
      var model = (modelCheck.length > 1 ? modelCheck[1] : null)
      var addr = rinfo.address
      if (!(addr in self.foundSonosDevices)) {
        var sonos = self.foundSonosDevices[addr] = new Sonos(addr)
        self.emit('DeviceAvailable', sonos, model)
      }
    }
  })
  this.socket.on('close', function () {
    if (self.searchTimer) {
      clearTimeout(self.searchTimer)
    }
    clearTimeout(self.pollTimer)
  })
  this.socket.on('error', function (err) {
    self.emit('error', err)
  })
  this.socket.bind(options, function () {
    self.socket.setBroadcast(true)
    sendDiscover()
  })
  if (options.timeout) {
    self.searchTimer = setTimeout(function () {
      self.socket.close()
      self.emit('timeout')
    }, options.timeout)
  }
  return this
}
util.inherits(Search, EventEmitter)

/**
 * Destroys Search class, stop searching, clean up
 *
 * @param  {Function} callback ()
 */
Search.prototype.destroy = function (callback) {
  clearTimeout(this.searchTimer)
  clearTimeout(this.pollTimer)
  this.socket.close(callback)
}

/**
 * Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)
 * @param  {Object} options Optional Options to control search behavior.
 *                          Set 'timeout' to how long to search for devices
 *                          (in milliseconds).
 * @param  {Function} listener Optional 'DeviceAvailable' listener (sonos)
 * @return {Search/EventEmitter Instance}
 */
var search = function (options, listener) {
  if (typeof options === 'function') {
    listener = options
    options = null
  }
  options = options || {}
  listener = listener || null
  var search = new Search(options)
  if (listener !== null) {
    search.on('DeviceAvailable', listener)
  }
  return search
}

/**
 * Export
 */
module.exports.Sonos = Sonos
module.exports.search = search
module.exports.Services = Services
module.exports.Listener = Listener
module.exports.SpotifyRegion = SpotifyRegion
