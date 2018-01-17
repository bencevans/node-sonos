/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires 'events'
 * @requires 'request-promise-native'
 * @requires 'debug'
 * @requires 'underscore'
 * @requires './events/listener'
 */

 // Some constants
const TRANSPORT_ENDPOINT = '/MediaRenderer/AVTransport/Control'
const RENDERING_ENDPOINT = '/MediaRenderer/RenderingControl/Control'
const DEVICE_ENDPOINT = '/DeviceProperties/Control'

// Dependencies
const util = require('util')
const EventEmitter = require('events').EventEmitter
const request = require('request-promise-native')
const debug = require('debug')('sonos')
const _ = require('underscore')
const Listener = require('./events/adv-listener')
const Helpers = require('./helpers')

// All the services
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

var SpotifyRegion = {
  EU: '2311',
  US: '3079'
}

/**
 * Create an instance of Sonos
 * @class Sonos
 * @param {String} host IP/DNS
 * @param {Number} port
 * @return {Sonos}
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
  var implicitListen = async function (event, listener) {
    if (event === 'newListener') return
    self.removeListener('newListener', implicitListen)
    return Listener.subscribeTo(self).catch(err => {
      debug('Error subscribing to listener %j', err)
    })
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
 * @param  {String}   body        The XML body to be send, will be put in an soap envelope
 * @param  {String}   responseTag Expected Response Container XML Tag
 * @returns {Promise}
 */
Sonos.prototype.request = function (endpoint, action, body, responseTag) {
  debug('Sonos.request(%j, %j, %j, %j, %j)', endpoint, action, body, responseTag)
  return new Promise((resolve, reject) => {
    let soapBody = Helpers.CreateSoapEnvelop(body)
    request({
      uri: 'http://' + this.host + ':' + this.port + endpoint,
      method: 'POST',
      headers: {
        'SOAPAction': action,
        'Content-type': 'text/xml; charset=utf8'
      },
      body: soapBody
    }).then(Helpers.ParseXml) // Run the result through the xml parser
    .then(result => { // Do something with the response (that is converted to an object)
      if (!result || !result['s:Envelope']) {
        reject(new Error('Invalid response for ' + action + ': ' + result))
      } else if (typeof result['s:Envelope']['s:Body']['s:Fault'] !== 'undefined') {
        reject(result['s:Envelope']['s:Body']['s:Fault'])
      } else {
        resolve(result['s:Envelope']['s:Body'][responseTag])
      }
    }).catch((reason) => {
      debug('Result NOT Ok, or parsing went wrong %j', reason)
      reject(reason)
    })
  })
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns {Object}  {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getMusicLibrary = async function (searchType, options) {
  return this.searchMusicLibrary(searchType, null, options)
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {String}   searchTerm  Optional - search term to search for
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.searchMusicLibrary = async function (searchType, searchTerm, options) {
  const searchTypes = {
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
  let searches = searchTypes[searchType]

  var opensearch = (!searchTerm) || (searchTerm === '')
  if (!opensearch) searches = searches.concat(':' + searchTerm)

  var opts = {
    ObjectID: searches
  }
  if (options.start !== undefined) opts.StartingIndex = options.start
  if (options.total !== undefined) opts.RequestedCount = options.total
  opts = _.extend(defaultOptions, opts)
  let contentDirectory = new Services.ContentDirectory(this.host, this.port)
  if (opensearch) {
    return contentDirectory.GetContainerResult(opts)
  } else {
    return contentDirectory.GetItemResult(opts)
  }
}

/**
 * Get Sonos Favorites
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavorites = async function () {
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
  let contentDirectory = new Services.ContentDirectory(this.host, this.port)
  return contentDirectory.GetItemResult(opts)
}

/**
 * Get Current Track
 * @returns {Object} All the info of the current track
 */
Sonos.prototype.currentTrack = async function () {
  debug('Sonos.currentTrack()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"'
    const body = '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>'
    const responseTag = 'u:GetPositionInfoResponse'
    this.request(this.options.endpoints.transport, action, body, responseTag)
      .then(async result => {
        let position = Helpers.TimeToSeconds(result.RelTime)
        let duration = Helpers.TimeToSeconds(result.TrackDuration)
        let trackUri = result.TrackURI || null
        let queuePosition = parseInt(result.Track)
        if (result.TrackMetaData) { // There is some metadata, lets parse it.
          var metadata = await Helpers.ParseXml(result.TrackMetaData)
          let track = Helpers.ParseDIDL(metadata)
          track.position = position
          track.duration = duration
          track.albumArtURL = !track.albumArtURI ? null
            : track.albumArtURI.startsWith('http') ? track.albumArtURI
              : 'http://' + this.host + ':' + this.port + track.albumArtURI
          if (trackUri) track.uri = trackUri
          track.queuePosition = queuePosition
          resolve(track)
        } else { // No metadata.
          resolve({ position: position, duration: duration, queuePosition: queuePosition, uri: trackUri })
        }
      })
      .catch(reject)
  })
}

/**
 * Get Current Volume
 * @returns {Number} The current volume
 */
Sonos.prototype.getVolume = async function () {
  debug('Sonos.getVolume()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"'
    const body = '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>'
    const responseTag = 'u:GetVolumeResponse'

    this.request(this.options.endpoints.rendering, action, body, responseTag)
      .then(result => {
        resolve(parseInt(result.CurrentVolume, 10))
      }).catch(reject)
  })
}

/**
 * Get Current Muted
 * @returns {Boolean}
 */
Sonos.prototype.getMuted = async function () {
  debug('Sonos.getMuted()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"'
    const body = '<u:GetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>'
    const responseTag = 'u:GetMuteResponse'
    this.request(this.options.endpoints.rendering, action, body, responseTag)
    .then(result => {
      resolve(!!parseInt(result.CurrentMute, 10))
    })
    .catch(reject)
  })
}

/**
 * Resumes Queue or Plays Provided URI
 * @param  {String|Object}   options      Optional - URI to a Audio Stream or Object with play options
 * @returns {Boolean} Started playing?
 */
Sonos.prototype.play = async function (options) {
  debug('Sonos.play(%j)', options)
  return new Promise((resolve, reject) => {
    if (!options) { // No Uri means, just start playing
      let action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"'
      let body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>'
      this.request(this.options.endpoints.transport, action, body, 'u:PlayResponse')
        .then(result => {
          resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
        })
        .catch(reject)
    } else {
      this.queue(options)
        .then(queueResult => {
          if (!queueResult || !queueResult.FirstTrackNumberEnqueued) {
            reject(new Error('Something when wrong with queueing'))
          } else {
            this.selectTrack(queueResult.FirstTrackNumberEnqueued)
              .then(selectResult => {
                this.play().then(resolve).catch(reject)
              }).catch(reject)
          }
        })
        .catch(reject)
    }
  })
}

/**
 * Plays a uri directly (the queue stays the same)
 * @param  {String|Object}   options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
 * @returns {Boolean}
 */
Sonos.prototype.setAVTransportURI = async function (options) {
  debug('Sonos.setAVTransportURI(%j)', options)
  return new Promise((resolve, reject) => {
    if (typeof options !== 'string' && typeof options !== 'object') {
      reject(new Error('Options should be an object or a string'))
    }

    // If the options is a string try to generate metadata from it
    if (typeof options === 'string') options = Helpers.GenerateMetadata(options, undefined, this.options.spotify.region)

    if (options.uri) {
      let action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"'
      let body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + Helpers.EncodeXml(options.uri) + '</CurrentURI><CurrentURIMetaData>' + Helpers.EncodeXml(options.metadata) + '</CurrentURIMetaData></u:SetAVTransportURI>'
      this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse')
        .then(result => {
          if (result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
            this.play().then(resolve).catch(reject)
          }
        }).catch(reject)
    } else {
      reject(new Error('Error with uri'))
    }
  })
}

/**
 * Stop What's Playing
 * @returns {Promise}
 */
Sonos.prototype.stop = async function () {
  debug('Sonos.stop()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Stop"'
    const body = '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>'
    this.request(this.options.endpoints.transport, action, body, 'u:StopResponse')
        .then(result => {
          resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
        })
        .catch(reject)
  })
}

/**
 * Become Coordinator of Standalone Group
 * @returns {Promise}
 */
Sonos.prototype.becomeCoordinatorOfStandaloneGroup = async function () {
  debug('Sonos.becomeCoordinatorOfStandaloneGroup()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#BecomeCoordinatorOfStandaloneGroup"'
    const body = '<u:BecomeCoordinatorOfStandaloneGroup xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:BecomeCoordinatorOfStandaloneGroup>'
    return this.request(this.options.endpoints.transport, action, body, 'u:BecomeCoordinatorOfStandaloneGroupResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)
 * @returns {Promise}
 */
Sonos.prototype.leaveGroup = async function () { return this.becomeCoordinatorOfStandaloneGroup() }

/**
 * Join an other device by name
 * @param  {String} otherDeviceName The name of de device you want to join, doesn't matter if that isn't the coordinator
 * @returns {Boolean}
 */
Sonos.prototype.joinGroup = function (otherDeviceName) {
  debug('Sonos.joinGroup()')
  return new Promise((resolve, reject) => {
    this.getTopology()
      .then(result => {
        var zoneInfo = result.zones.find(z => z.name.toLowerCase() === otherDeviceName.toLowerCase())
        if (!zoneInfo) {
          reject(new Error('Device with name ' + otherDeviceName + ' isn\'t found'))
        } else {
            // If the found device is the coordinator we just need his uuid, else we extract it from the group.
          var groupId = zoneInfo.coordinator ? zoneInfo.uuid : zoneInfo.group.split(':')[0]
          debug('Found group ID %s', groupId)
          this.setAVTransportURI('x-ricon:' + groupId).then(resolve).catch(reject)
        }
      })
      .catch(reject)
  })
}

/**
 * Pause Current Queue
 * @returns {Boolean}
 */
Sonos.prototype.pause = async function () {
  debug('Sonos.pause()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"'
    const body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>'
    this.request(this.options.endpoints.transport, action, body, 'u:PauseResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Seek in the current track
 * @param  {Number} seconds jump to x seconds.
 * @returns {Boolean}
 */
Sonos.prototype.seek = async function (seconds) {
  debug('Sonos.seek()')
  return new Promise((resolve, reject) => {
    let hh = Math.floor(seconds / 3600)
    let mm = Math.floor((seconds - (hh * 3600)) / 60)
    let ss = seconds - ((hh * 3600) + (mm * 60))
    if (hh < 10) hh = '0' + hh
    if (mm < 10) mm = '0' + mm
    if (ss < 10) ss = '0' + ss
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"'
    const body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>REL_TIME</Unit><Target>' + hh + ':' + mm + ':' + ss + '</Target></u:Seek>'
    this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Select specific track in queue
 * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
 */
Sonos.prototype.selectTrack = async function (trackNr) {
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"'
    const body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>' + trackNr + '</Target></u:Seek>'
    this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Play next in queue
 * @returns {Boolean}
 */
Sonos.prototype.next = async function () {
  debug('Sonos.next()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Next"'
    const body = '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>'
    this.request(this.options.endpoints.transport, action, body, 'u:NextResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Play previous in queue
 * @returns {Boolean}
 */
Sonos.prototype.previous = async function () {
  debug('Sonos.previous()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#Previous"'
    const body = '<u:Previous xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Previous>'
    this.request(this.options.endpoints.transport, action, body, 'u:PreviousResponse')
      .then(result => {
        resolve(result['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1')
      })
      .catch(reject)
  })
}

/**
 * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
 * @returns {Boolean} success
 */
Sonos.prototype.selectQueue = async function () {
  debug('Sonos.selectQueue()')
  return new Promise((resolve, reject) => {
    this.getZoneInfo()
      .then(info => {
        let uri = 'x-rincon-queue:RINCON_' + info.MACAddress.replace(/:/g, '') + '0' + this.port + '#0'
        this.setAVTransportURI(uri).then(resolve).catch(reject)
      })
      .catch(reject)
  })
}

/**
 * Plays tunein based on radio station id
 * @param  {String}   stationId  tunein radio station id
 * @returns {Boolean}
 */
Sonos.prototype.playTuneinRadio = async function (stationId, stationTitle) {
  debug('Sonos.playTuneinRadio(%j, %j)', stationId, stationTitle)

  var options = Helpers.GenerateMetadata('radio:' + stationId, stationTitle)
  return this.setAVTransportURI(options)
}

/**
 * Plays Spotify radio based on artist uri
 * @param  {String}   artistId  Spotify artist id
 * @returns {Boolean}
 */
Sonos.prototype.playSpotifyRadio = async function (artistId, artistName) {
  debug('Sonos.playSpotifyRadio(%j, %j)', artistId, artistName)
  var options = Helpers.GenerateMetadata('spotify:artistRadio:' + artistId, artistName, this.options.spotify.region)
  return this.setAVTransportURI(options)
}

/**
 * Queue a Song Next, was setAVTransportUri already in the library?
 * @param  {String|Object}   options      URI to Audio Stream or Object containing options (uri, metadata)
 * @returns {Boolean}
 */
Sonos.prototype.queueNext = async function (options) {
  debug('Sonos.queueNext(%j)', options)
  return this.setAVTransportURI(options)
}

/**
 * Add a song to the queue.
 * @param  {String|Object}   options  Uri with audio stream of object with `uri` and `metadata`
 * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
 *                                    defaults to end of queue, 0 to explicitly set end of queue)
 * @returns {Object} Some info about the last queued file.
 */
Sonos.prototype.queue = async function (options, positionInQueue = 0) {
  debug('Sonos.queue(%j, %j)', options, positionInQueue)
  return new Promise((resolve, reject) => {
    if (typeof options === 'string') options = Helpers.GenerateMetadata(options, undefined, this.options.spotify.region)

    const action = '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"'
    const body = '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>' + Helpers.EncodeXml(options.uri) + '</EnqueuedURI><EnqueuedURIMetaData>' + Helpers.EncodeXml(options.metadata) + '</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>' + positionInQueue + '</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>'
    this.request(this.options.endpoints.transport, action, body, 'u:AddURIToQueueResponse').then(resolve).catch(reject)
  })
}

/**
 * Flush queue
 * @returns {Object}
 */
Sonos.prototype.flush = async function () {
  debug('Sonos.flush()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"'
    const body = '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>'
    this.request(this.options.endpoints.transport, action, body, 'u:RemoveAllTracksFromQueueResponse')
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Get the LED State
 * @returns {String} state is a string, "On" or "Off"
 */
Sonos.prototype.getLEDState = async function () {
  debug('Sonos.getLEDState()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"'
    const body = '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>'
    this.request(this.options.endpoints.device, action, body, 'u:GetLEDStateResponse')
      .then(result => {
        resolve(result.CurrentLEDState)
      })
      .catch(reject)
  })
}

/**
 * Set the LED State
 * @param  {String}   desiredState           "On"/"Off"
 */
Sonos.prototype.setLEDState = async function (desiredState) {
  debug('Sonos.setLEDState(%j)', desiredState)
  const action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetLEDState"'
  const body = '<u:SetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredLEDState>' + desiredState + '</DesiredLEDState></u:SetLEDState>'
  return this.request(this.options.endpoints.device, action, body, 'u:SetLEDStateResponse')
}

/**
 * Get Zone Info
 * @returns {Object}
 */
Sonos.prototype.getZoneInfo = async function () {
  debug('Sonos.getZoneInfo()')
  const action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"'
  const body = '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>'
  return this.request(this.options.endpoints.device, action, body, 'u:GetZoneInfoResponse')
}

/**
 * Get Zone Attributes
 * @returns {Object}
 */
Sonos.prototype.getZoneAttrs = async function () {
  debug('Sonos.getZoneAttrs()')
  const action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"'
  const body = '"<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>"'
  return this.request(this.options.endpoints.device, action, body, 'u:GetZoneAttributesResponse')
}

/**
 * Get Information provided by /xml/device_description.xml
 * @returns {Object}
 */
Sonos.prototype.deviceDescription = async function () {
  debug('Sonos.deviceDescription()')
  return new Promise((resolve, reject) => {
    request('http://' + this.host + ':' + this.port + '/xml/device_description.xml')
      .then(Helpers.ParseXml)
      .then(result => {
        resolve(result.root.device)
      })
      .catch(reject)
  })
}

/**
 * Set Name
 * @param  {String}   name
 * @returns {Object}
 */
Sonos.prototype.setName = async function (name) {
  debug('Sonos.setName(%j)', name)
  name = name.replace(/[<&]/g, function (str) { return (str === '&') ? '&amp;' : '&lt;' })
  const action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetZoneAttributes"'
  const body = '"<u:SetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredZoneName>' + name + '</DesiredZoneName><DesiredIcon /><DesiredConfiguration /></u:SetZoneAttributes>"'
  return this.request(this.options.endpoints.device, action, body, 'u:SetZoneAttributesResponse')
}

/**
 * Get Play Mode
 * @return {String}
 */
Sonos.prototype.getPlayMode = async function () {
  debug('Sonos.getPlayMode()')
  return new Promise((resolve, reject) => {
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportSettings"'
    const body = '<u:GetTransportSettings xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportSettings>'
    this.request(this.options.endpoints.transport, action, body, 'u:GetTransportSettingsResponse')
      .then(result => {
        resolve(result.playmode)
      })
      .catch(reject)
  })
}

/**
 * Set Play Mode
 * @param  {String} playmode
 * @returns {Object}
 */
Sonos.prototype.setPlayMode = async function (playmode) {
  debug('Sonos.setPlayMode(%j)', playmode)
  return new Promise((resolve, reject) => {
    var mode = { NORMAL: true, REPEAT_ALL: true, SHUFFLE: true, SHUFFLE_NOREPEAT: true }[playmode.toUpperCase()]
    if (!mode) reject(new Error('invalid play mode ' + playmode))
    const action = '"urn:schemas-upnp-org:service:AVTransport:1#SetPlayMode"'
    const body = '<u:SetPlayMode xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewPlayMode>' + playmode.toUpperCase() + '</NewPlayMode></u:SetPlayMode>'
    this.request(this.options.endpoints.transport, action, body, 'u:SetPlayModeResponse')
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Set Volume
 * @param  {String}   volume 0..100
 * @returns {Object}
 */
Sonos.prototype.setVolume = async function (volume) {
  debug('Sonos.setVolume(%j)', volume)
  const action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"'
  const body = '<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>' + volume + '</DesiredVolume></u:SetVolume>'
  return this.request(this.options.endpoints.rendering, action, body, 'u:SetVolumeResponse')
}

/**
 * Configure Sleep Timer
 * @param  {String} sleepTimerDuration
 * @returns {Object}
 */
Sonos.prototype.configureSleepTimer = async function (sleepTimerDuration) {
  debug('Sonos.sleepTimerDuration(%j)', sleepTimerDuration)
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#ConfigureSleepTimer"'
  var body = '<u:ConfigureSleepTimer xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewSleepTimerDuration>' + sleepTimerDuration + '</NewSleepTimerDuration></u:ConfigureSleepTimer>'
  return this.request(this.options.endpoints.transport, action, body, 'u:ConfigureSleepTimerResponse')
}

/**
 * Set Muted
 * @param  {Boolean}  muted
 * @returns {Object}
 */
Sonos.prototype.setMuted = async function (muted) {
  debug('Sonos.setMuted(%j)', muted)
  if (typeof muted === 'string') muted = !!parseInt(muted, 10)
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetMute"'
  var body = '<u:SetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>' + (muted ? '1' : '0') + '</DesiredMute></u:SetMute>'
  return this.request(this.options.endpoints.rendering, action, body, 'u:SetMutedResponse')
}

/**
 * Get Zones in contact with current Zone with Group Data
 * @returns {Object}
 */
Sonos.prototype.getTopology = async function () {
  debug('Sonos.getTopology()')
  return new Promise((resolve, reject) => {
    request('http://' + this.host + ':' + this.port + '/status/topology')
      .then(Helpers.ParseXml)
      .then(result => {
        debug('getTopologyResult %j', result)
        const info = result.ZPSupportInfo
        let zones, mediaServers

        zones = info.ZonePlayers.ZonePlayer

        zones.forEach(zone => {
          zone.name = zone['_']
          delete zone['_']
        })

        mediaServers = info.MediaServers.MediaServer
        mediaServers.forEach(s => {
          s.name = s['_']
          delete s['_']
        })

        resolve({zones: zones, mediaServers: mediaServers})
      })
      .catch(reject)
  })
}
/**
 * Get Current Playback State
 * @returns {String} the current playback state
 */
Sonos.prototype.getCurrentState = function () {
  debug('Sonos.currentState()')
  const action = '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"'
  const body = '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>'
  return this.request(this.options.endpoints.transport, action, body, 'u:GetTransportInfoResponse')
    .then(result => {
      return Helpers.TranslateState(result.CurrentTransportState)
    })
}
/**
 * Get Favorites Radio Stations
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadioStations = async function (options) {
  return this.getFavoritesRadio('stations', options)
}

/**
 * Get Favorites Radio Shows
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadioShows = async function (options) {
  return this.getFavoritesRadio('shows', options)
}

/**
 * Get Favorites Radio for a given radio type
 * @param  {String}   favoriteRadioType  Choice - stations, shows
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns  {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavoritesRadio = async function (favoriteRadioType, options = {}) {
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
  return contentDirectory.GetItemResult(opts)
}

Sonos.prototype.setSpotifyRegion = function (region) {
  this.options.spotify.region = region
}

/**
 * Get the current queue
 * @returns  {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getQueue = async function () {
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
  return contentDirectory.GetItemResult(opts)
}

Sonos.prototype.getSpotifyConnect = async function () {
  const uri = 'http://' + this.host + ':' + this.port + '/spotifyzc?action=getInfo'
  return request(uri).then(JSON.parse)
}

// ----------------------------- Services part

Sonos.prototype.alarmClockService = function () {
  return new Services.AlarmClock(this.host)
}

// ----------------------------- End Services part

/**
 * Export
 */
const deviceDiscovery = require('./deviceDiscovery')
module.exports.Sonos = Sonos
module.exports.DeviceDiscovery = deviceDiscovery
module.exports.Search = deviceDiscovery // Because are going to complain about me (@svrooij) removing it...
module.exports.Helpers = Helpers
module.exports.Services = Services
module.exports.Listener = Listener
module.exports.SpotifyRegion = SpotifyRegion
