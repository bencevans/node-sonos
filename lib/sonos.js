/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires 'events'
 * @requires 'request-promise-native'
 * @requires 'debug'
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
const Listener = require('./events/adv-listener')
const Helpers = require('./helpers')
const url = require('url');

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
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns {Object}  {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getMusicLibrary = async function (searchType, options) {
  return this.searchMusicLibrary(searchType, null, options, null)
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {String}   searchTerm  Optional - search term to search for
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @param  {String}   separator   Optional - default is colon. Values : colon or slash
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.searchMusicLibrary = async function (searchType, searchTerm, options, separator = ':') {
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
  if (!opensearch) {
    searches = EncodeURIComponent(searches)
    searches = searches.concat(separator + searchTerm)
  }

  var opts = {
    ObjectID: searches
  }
  if (options.start !== undefined) opts.StartingIndex = options.start
  if (options.total !== undefined) opts.RequestedCount = options.total
  // opts = _.extend(defaultOptions, opts)
  Object.assign(opts, defaultOptions)
  let contentDirectory = this.contentDirectoryService()
  return contentDirectory.GetResult(opts)
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

  // opts = _.extend(defaultOptions, opts)
  Object.assign(opts, defaultOptions)
  return this.contentDirectoryService().GetItemResult(opts)
}

/**
 * Get Current Track
 * @returns {Object} All the info of the current track
 */
Sonos.prototype.currentTrack = async function () {
  debug('Sonos.currentTrack()')
  return this.avTransportService().CurrentTrack()
}

/**
 * Get Current Volume
 * @returns {Number} The current volume
 */
Sonos.prototype.getVolume = async function () {
  debug('Sonos.getVolume()')
  return this.renderingControlService().GetVolume()
}

/**
 * Get Current Muted
 * @returns {Boolean}
 */
Sonos.prototype.getMuted = async function () {
  debug('Sonos.getMuted()')
  return this.renderingControlService().GetMute()
}

/**
 * Resumes Queue or Plays Provided URI
 * @param  {String|Object}   options      Optional - URI to a Audio Stream or Object with play options
 * @returns {Boolean} Started playing?
 */
Sonos.prototype.play = async function (options) {
  debug('Sonos.play(%j)', options)
  if (!options) {
    return this.avTransportService().Play().then(result => { return true })
  } else {
    return this.queue(options)
      .then(result => {
        return this.selectTrack(result.FirstTrackNumberEnqueued)
      })
      .then(result => {
        return this.play()
      })
  }
}

/**
 * Plays a uri directly (the queue stays the same)
 * @param  {String|Object}   options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
 * @returns {Boolean}
 */
Sonos.prototype.setAVTransportURI = async function (options) {
  debug('Sonos.setAVTransportURI(%j)', options)

  if (typeof options !== 'string' && typeof options !== 'object') {
    return new Error('Options should be an object or a string')
  }

  // If the options is a string try to generate metadata from it
  if (typeof options === 'string') options = Helpers.GenerateMetadata(options, undefined, this.options.spotify.region)

  // We need this later.
  const self = this

  if (options.uri) {
    return this.avTransportService().SetAVTransportURI({
      InstanceID: 0,
      CurrentURI: Helpers.EncodeXml(options.uri),
      CurrentURIMetaData: Helpers.EncodeXml(options.metadata)
    }).then(result => {
      // Start playing by default, the notifications don't want to start playing by default.
      if ((!options.onlySetUri || options.onlySetUri !== true) && result) {
        return self.play()
      }
      return true
    })
  } else {
    return new Error('Error with uri')
  }
}

/**
 * Stop What's Playing
 * @returns {Promise}
 */
Sonos.prototype.stop = async function () {
  debug('Sonos.stop()')
  return this.avTransportService().Stop().then(result => { return true })
}

/**
 * Become Coordinator of Standalone Group
 * @returns {Promise}
 */
Sonos.prototype.becomeCoordinatorOfStandaloneGroup = async function () {
  debug('Sonos.becomeCoordinatorOfStandaloneGroup()')
  return this.avTransportService().BecomeCoordinatorOfStandaloneGroup().then(result => { return true })
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

  return this.getTopology()
    .then(result => {
      const zoneInfo = result.zones.find(z => z.name.toLowerCase() === otherDeviceName.toLowerCase())
      if (!zoneInfo) {
        return new Error('Device with name ' + otherDeviceName + ' isn\'t found')
      } else {
          // If the found device is the coordinator we just need his uuid, else we extract it from the group.
        var groupId = zoneInfo.coordinator ? zoneInfo.uuid : zoneInfo.group.split(':')[0]
        debug('Found group ID %s', groupId)
        return this.setAVTransportURI('x-rincon:' + groupId)
      }
    })
}

/**
 * Pause Current Queue
 * @returns {Boolean}
 */
Sonos.prototype.pause = async function () {
  debug('Sonos.pause()')
  return this.avTransportService().Pause().then(result => { return true })
}

/**
 * Seek in the current track
 * @param  {Number} seconds jump to x seconds.
 * @returns {Boolean}
 */
Sonos.prototype.seek = async function (seconds) {
  debug('Sonos.seek()')
  let hh = Math.floor(seconds / 3600)
  let mm = Math.floor((seconds - (hh * 3600)) / 60)
  let ss = seconds - ((hh * 3600) + (mm * 60))
  if (hh < 10) hh = '0' + hh
  if (mm < 10) mm = '0' + mm
  if (ss < 10) ss = '0' + ss
  return this.avTransportService().Seek({
    InstanceID: 0,
    Unit: 'REL_TIME',
    Target: hh + ':' + mm + ':' + ss
  }).then(result => { return true })
}

/**
 * Select specific track in queue
 * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
 */
Sonos.prototype.selectTrack = async function (trackNr) {
  debug('Sonos.selectTrack(%j)', trackNr)
  return this.avTransportService().Seek({
    InstanceID: 0,
    Unit: 'TRACK_NR',
    Target: trackNr
  }).then(result => { return true })
}

/**
 * Play next in queue
 * @returns {Boolean}
 */
Sonos.prototype.next = async function () {
  debug('Sonos.next()')
  return this.avTransportService().Next().then(result => { return true })
}

/**
 * Play previous in queue
 * @returns {Boolean}
 */
Sonos.prototype.previous = async function () {
  debug('Sonos.previous()')
  return this.avTransportService().Previous().then(result => { return true })
}

/**
 * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
 * @returns {Boolean} success
 */
Sonos.prototype.selectQueue = async function () {
  debug('Sonos.selectQueue()')
  return this.getZoneInfo()
    .then(info => {
      let uri = 'x-rincon-queue:RINCON_' + info.MACAddress.replace(/:/g, '') + '0' + this.port + '#0'
      return this.setAVTransportURI(uri)
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
 * Add a song to the queue.
 * @param  {String|Object}   options  Uri with audio stream of object with `uri` and `metadata`
 * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
 *                                    defaults to end of queue, 0 to explicitly set end of queue)
 * @returns {Object} Some info about the last queued file.
 */
Sonos.prototype.queue = async function (options, positionInQueue = 0) {
  debug('Sonos.queue(%j, %j)', options, positionInQueue)
  if (typeof options === 'string') options = Helpers.GenerateMetadata(options, undefined, this.options.spotify.region)
  return this.avTransportService().AddURIToQueue({
    InstanceID: 0,
    EnqueuedURI: Helpers.EncodeXml(options.uri),
    EnqueuedURIMetaData: Helpers.EncodeXml(options.metadata),
    DesiredFirstTrackNumberEnqueued: positionInQueue,
    EnqueueAsNext: 1
  })
}

/**
 * Flush queue
 * @returns {Object}
 */
Sonos.prototype.flush = async function () {
  debug('Sonos.flush()')
  return this.avTransportService().RemoveAllTracksFromQueue()
}

/**
 * Get the LED State
 * @returns {String} state is a string, "On" or "Off"
 */
Sonos.prototype.getLEDState = async function () {
  debug('Sonos.getLEDState()')
  return this.devicePropertiesService().GetLEDState()
}

/**
 * Set the LED State
 * @param  {String}   newState           "On"/"Off"
 */
Sonos.prototype.setLEDState = async function (newState) {
  debug('Sonos.setLEDState(%j)', newState)
  return this.devicePropertiesService().SetLEDState(newState)
}

/**
 * Get Zone Info
 * @returns {Object}
 */
Sonos.prototype.getZoneInfo = async function () {
  debug('Sonos.getZoneInfo()')
  return this.devicePropertiesService().GetZoneInfo()
}

/**
 * Get Zone Attributes
 * @returns {Object}
 */
Sonos.prototype.getZoneAttrs = async function () {
  debug('Sonos.getZoneAttrs()')
  return this.devicePropertiesService().GetZoneAttributes()
}

/**
 * Get Information provided by /xml/device_description.xml
 * @returns {Object}
 */
Sonos.prototype.deviceDescription = async function () {
  debug('Sonos.deviceDescription()')
  return request('http://' + this.host + ':' + this.port + '/xml/device_description.xml')
    .then(Helpers.ParseXml)
    .then(result => {
      return result.root.device
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
  return this.devicePropertiesService().SetZoneAttributes({
    DesiredConfiguration: null,
    DesiredIcon: null,
    DesiredZoneName: name
  })
}

/**
 * Get Play Mode
 * @return {String}
 */
Sonos.prototype.getPlayMode = async function () {
  debug('Sonos.getPlayMode()')
  return this.avTransportService().GetTransportSettings()
    .then(result => {
      return result.playmode
    })
}

/**
 * Set Play Mode
 * @param  {String} playmode
 * @returns {Object}
 */
Sonos.prototype.setPlayMode = async function (playmode) {
  debug('Sonos.setPlayMode(%j)', playmode)
  var mode = { NORMAL: true, REPEAT_ALL: true, SHUFFLE: true, SHUFFLE_NOREPEAT: true }[playmode.toUpperCase()]
  if (!mode) return new Error('Invalid play mode: ' + playmode)
  return this.avTransportService().SetPlayMode(mode)
}

/**
 * Set Volume
 * @param  {number}   volume 0..100
 * @param  {string}   channel What channel to change, `Master` is default.
 * @returns {Object}
 */
Sonos.prototype.setVolume = async function (volume, channel = 'Master') {
  debug('Sonos.setVolume(%j)', volume)
  return this.renderingControlService().SetVolume(volume, channel)
}

/**
 * Configure Sleep Timer
 * @param  {String} sleepTimerDuration
 * @returns {Object}
 */
Sonos.prototype.configureSleepTimer = async function (sleepTimerDuration) {
  debug('Sonos.sleepTimerDuration(%j)', sleepTimerDuration)
  return this.avTransportService().ConfigureSleepTimer(sleepTimerDuration)
}

/**
 * Set Muted
 * @param  {Boolean}  muted
 * @param  {string}   channel What channel to change, `Master` is default.
 * @returns {Object}
 */
Sonos.prototype.setMuted = async function (muted, channel = 'Master') {
  debug('Sonos.setMuted(%j)', muted)
  if (typeof muted === 'string') muted = !!parseInt(muted, 10)
  return this.renderingControlService().SetMute(muted, channel)
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
  return this.avTransportService().GetTransportInfo()
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
  // opts = _.extend(defaultOptions, opts)
  Object.assign(opts, defaultOptions)
  return this.contentDirectoryService().GetItemResult(opts)
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

  // opts = _.extend(defaultOptions, opts)
  Object.assign(opts, defaultOptions)
  return this.contentDirectoryService().GetItemResult(opts)
}

/**
 * Play uri and restore last state
 * @param  {String|Object}  options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
 * @param  {String}         options.uri The URI of the stream
 * @param  {String}         options.metadata The metadata of the stream see `Helpers.GenerateMetadata`
 * @param  {Boolean}        options.onlyWhenPlaying Only play this notification on players currently 'playing'
 * @param  {Number}         options.volume The volume used for the notification.
 * @returns {Boolean}       Did the notification play? Only returns when finished reverting to old play settings.
 */
Sonos.prototype.playNotification = async function (options) {
  return new Promise(async (resolve, reject) => {
    debug('sonos.playNotification(%j)', options)
    const state = await this.getCurrentState()
    const wasPlaying = (state === 'playing' || state === 'transitioning')
    const wasListening = Listener.isListening()
    let volume = 0
    if (typeof options === 'object') {
      if (!options.uri) {
        return reject(new Error('options.uri is required.'))
      }
      // Return false when not playing.
      if (!wasPlaying && options.onlyWhenPlaying === true) {
        return resolve(false)
      }

      if (options.volume) {
        volume = await this.getVolume()
      }

      if (!options.metadata) {
        options.metadata = Helpers.GenerateMetadata(options.uri).metadata
      }
    }

    const mediaInfo = await this.avTransportService().GetMediaInfo()
    await this.setAVTransportURI(options)
    if (volume > 0) await this.setVolume(options.volume)
    const self = this

    this.once('PlaybackStopped', async () => {
      debug('sonos.playNotification reverting back to before')
      if (volume > 0) await this.setVolume(volume)
      if (!wasListening) await Listener.stopListener()
      self.setAVTransportURI({uri: mediaInfo.CurrentURI, metadata: mediaInfo.CurrentURIMetaData, onlySetUri: !wasPlaying}).then(resolve).catch(reject)
    })
  })
}

/**
 * Reorder tracks in queue.
 * @param {number} startingIndex Index of the first track to be moved
 * @param {number} numberOfTracks How many tracks do we want to move
 * @param {number} insertBefore Index of place where the tracks should be moved to
 * @param {number} updateId Not sure what this means, just leave it at `0`
 */
Sonos.prototype.reorderTracksInQueue = async function (startingIndex, numberOfTracks, insertBefore, updateId = 0) {
  return this.avTransportService().ReorderTracksInQueue({
    InstanceID: 0,
    UpdateID: updateId,
    StartingIndex: startingIndex,
    NumberOfTracks: numberOfTracks,
    InsertBefore: insertBefore
  })
}

/**
 * Get SpotifyConnect info, will error when no premium account is present
 */
Sonos.prototype.getSpotifyConnectInfo = async function () {
  const uri = 'http://' + this.host + ':' + this.port + '/spotifyzc?action=getInfo'
  return request(uri).then(JSON.parse)
}

// ----------------------------- Services part

Sonos.prototype.alarmClockService = function () {
  return new Services.AlarmClock(this.host, this.port)
}

Sonos.prototype.avTransportService = function () {
  return new Services.AVTransport(this.host, this.port)
}

Sonos.prototype.contentDirectoryService = function () {
  return new Services.ContentDirectory(this.host, this.port)
}

Sonos.prototype.devicePropertiesService = function () {
  return new Services.DeviceProperties(this.host, this.port)
}

Sonos.prototype.renderingControlService = function () {
  return new Services.RenderingControl(this.host, this.port)
}

// ----------------------------- End Services part

/**
 * Export
 */

module.exports.Sonos = Sonos
const deviceDiscovery = require('./deviceDiscovery')
module.exports.DeviceDiscovery = deviceDiscovery
module.exports.Search = deviceDiscovery // Because people are going to complain about me (@svrooij) removing it...
module.exports.Helpers = Helpers
module.exports.Services = Services
module.exports.Listener = Listener
module.exports.SpotifyRegion = SpotifyRegion
