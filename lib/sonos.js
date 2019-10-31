/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires 'events'
 * @requires 'axios'
 * @requires 'debug'
 * @requires './events/listener'
 */

// Some constants
const TRANSPORT_ENDPOINT = '/MediaRenderer/AVTransport/Control'
const RENDERING_ENDPOINT = '/MediaRenderer/RenderingControl/Control'
const DEVICE_ENDPOINT = '/DeviceProperties/Control'

// Dependencies
const URL = require('url').URL
const util = require('util')
const EventEmitter = require('events').EventEmitter
const request = require('axios')
const debug = require('debug')('sonos:main')
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
 * @returns {Sonos}
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
  return this.searchMusicLibrary(searchType, null, options)
}

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {String}   searchTerm  Optional - search term to search for
 * @param  {Object}   requestOptions     Optional - default {start: 0, total: 100}
 * @param  {String}   separator   Optional - default is colon. `:` or `/`
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.searchMusicLibrary = async function (searchType, searchTerm, requestOptions = {}, separator = ':') {
  const searchTypes = {
    artists: 'A:ARTIST',
    albumArtists: 'A:ALBUMARTIST',
    albums: 'A:ALBUM',
    genres: 'A:GENRE',
    composers: 'A:COMPOSER',
    tracks: 'A:TRACKS',
    playlists: 'A:PLAYLISTS',
    sonos_playlists: 'SQ',
    share: 'S'
  }
  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: ''
  }
  let searches = `${searchTypes[searchType]}${separator}`

  if (searchTerm && searchTerm !== '') {
    searches = searches.concat(encodeURI(searchTerm))
  }

  var opts = {
    ObjectID: searches
  }
  if (requestOptions && requestOptions.start !== undefined) opts.StartingIndex = requestOptions.start
  if (requestOptions && requestOptions.total !== undefined) opts.RequestedCount = requestOptions.total
  // opts = _.extend(defaultOptions, opts)
  opts = Object.assign({}, defaultOptions, opts)
  return this.contentDirectoryService().GetResult(opts)
}

/**
 * Get Sonos Playlist
 * @param {String}    playlistId      Sonos id of the playlist
 * @param  {Object}   requestOptions  Optional - default {start: 0, total: 100}
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getPlaylist = async function (playlistId, requestOptions = {}) {
  return this.searchMusicLibrary('sonos_playlists', playlistId, requestOptions)
}

/**
 * Create a new sonos playlist
 * @param {String}  title   Name of the playlist
 * @returns {Object} { NumTracksAdded: 0, NewQueueLength: 0, NewUpdateID: 0, AssignedObjectID: 'SQ:3' }
 */
Sonos.prototype.createPlaylist = async function (title) {
  debug('Sonos.createPlaylist(%j)', title)
  return this.avTransportService().CreateSavedQueue(title).then(result => {
    return {
      NumTracksAdded: parseInt(result.NumTracksAdded),
      NewQueueLength: parseInt(result.NewQueueLength),
      NewUpdateID: parseInt(result.NewUpdateID),
      AssignedObjectID: result.AssignedObjectID
    }
  }, () => {
    return {
      NumTracksAdded: 0,
      NewQueueLength: 0,
      NewUpdateID: 0,
      AssignedObjectID: null
    }
  })
}

/**
 * Delete sonos playlist
 * @param {Number}  objectId   Sonos id of the playlist
 * @returns {Boolean} Playlist deleted
 */
Sonos.prototype.deletePlaylist = async function (playlistId) {
  debug('Sonos.deletePlaylist()')
  return this.contentDirectoryService().DestroyObject({ ObjectID: `SQ:${playlistId}` }).then(() => { return true }, () => { return false })
}

/**
 * Add uri to sonos playlist
 * @param {Number}  playlistId   Sonos id of the playlist
 * @param {String}  uri   Uri to add to the playlist
 * @returns {Object} { NumTracksAdded: 1, NewQueueLength: 2, NewUpdateID: 2 }
 */
Sonos.prototype.addToPlaylist = async function (playlistId, uri) {
  debug('Sonos.addToPlaylist(%j, %j)', playlistId, uri)

  const result = await this.getPlaylist(playlistId)
  const meta = Helpers.GenerateMetadata(uri, undefined, this.options.spotify.region)

  return this.avTransportService().AddURIToSavedQueue({
    InstanceID: 0,
    ObjectID: `SQ:${playlistId}`,
    UpdateID: result.updateID,
    EnqueuedURI: Helpers.EncodeXml(meta.uri),
    EnqueuedURIMetaData: Helpers.EncodeXml(meta.metadata),
    AddAtIndex: 4294967295
  }).then(result => {
    return {
      NumTracksAdded: parseInt(result.NumTracksAdded),
      NewQueueLength: parseInt(result.NewQueueLength),
      NewUpdateID: parseInt(result.NewUpdateID)
    }
  }, () => {
    return {
      NumTracksAdded: 0,
      NewQueueLength: 0,
      NewUpdateID: 0
    }
  })
}

/**
 * Remove track from playlist
 * @param {Number}  playlistId   Sonos id of the playlist
 * @param {String}  index   Index of song to remove
 * @returns {Object} { QueueLengthChange: -1, NewQueueLength: 2, NewUpdateID: 2 }
 */
Sonos.prototype.removeFromPlaylist = async function (playlistId, index) {
  debug('Sonos.removeFromPlaylist(%j, %j)', playlistId, index)

  const result = await this.getPlaylist(playlistId)
  return this.avTransportService().ReorderTracksInSavedQueue({
    InstanceID: 0,
    ObjectID: `SQ:${playlistId}`,
    UpdateID: result.updateID,
    TrackList: index,
    NewPositionList: ''
  }).then(result => {
    return {
      QueueLengthChange: parseInt(result.QueueLengthChange),
      NewQueueLength: parseInt(result.NewQueueLength),
      NewUpdateID: parseInt(result.NewUpdateID)
    }
  }, () => {
    return {
      QueueLengthChange: 0,
      NewQueueLength: 0,
      NewUpdateID: 0
    }
  })
}

/**
 * Get Sonos Favorites
 * @returns {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getFavorites = async function () {
  const options = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: '',
    ObjectID: 'FV:2'
  }

  return this.contentDirectoryService().GetResult(options)
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
  if (this._isSubscribed && this._volume) return this._volume
  return this.renderingControlService().GetVolume()
}

/**
 * Get Current Muted
 * @returns {Boolean}
 */
Sonos.prototype.getMuted = async function () {
  debug('Sonos.getMuted()')
  if (this._isSubscribed && this._mute) return this._mute
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
 * @returns {boolean}
 */
Sonos.prototype.stop = async function () {
  debug('Sonos.stop()')
  return this.avTransportService().Stop().then(result => { return true })
}

/**
 * Get all the groups, replaces some functionality of 'getTopology()'
 */
Sonos.prototype.getAllGroups = async function () {
  debug('Sonos.GetAllGroups()')
  const zones = await this.zoneGroupTopologyService().AllZoneGroups()
  const zonesArray = Array.isArray(zones) ? zones : [zones]

  zonesArray.forEach((zone) => {
    if (zone.Coordinator) {
      const coordinator = zone.ZoneGroupMember.find((member) => {
        return member.UUID === zone.Coordinator
      })
      if (coordinator) {
        zone.Name = coordinator.ZoneName
        if (zone.ZoneGroupMember.length > 1) zone.Name += ` + ${zone.ZoneGroupMember.length - 1}`

        var uri = new URL(coordinator.Location)
        zone.host = uri.hostname
        zone.port = parseInt(uri.port)
        zone.CoordinatorDevice = function () {
          return new Sonos(this.host, this.port)
        }
      }
    } else if (zone.ZoneGroupMember.length > 0) {
      zone.Name = zone.ZoneGroupMember[0].ZoneName
    }
  })
  return zonesArray
}

/**
 * Become Coordinator of Standalone Group
 * @returns {boolean}
 */
Sonos.prototype.becomeCoordinatorOfStandaloneGroup = async function () {
  debug('Sonos.becomeCoordinatorOfStandaloneGroup()')
  return this.avTransportService().BecomeCoordinatorOfStandaloneGroup().then(result => { return true })
}

/**
 * Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)
 * @returns {boolean}
 */
Sonos.prototype.leaveGroup = async function () { return this.becomeCoordinatorOfStandaloneGroup() }

/**
 * Join an other device by name
 * @param  {String} otherDeviceName The name of de device you want to join, doesn't matter if that isn't the coordinator
 * @returns {Boolean}
 */
Sonos.prototype.joinGroup = function (otherDeviceName) {
  debug('Sonos.joinGroup(%j)', otherDeviceName)

  return this.getAllGroups()
    .then(groups => {
      const groupToJoin = groups.find(group =>
        group.ZoneGroupMember.some(member =>
          member.ZoneName.toLowerCase() === otherDeviceName.toLowerCase()))

      if (!groupToJoin) {
        return new Error(`Device with name ${otherDeviceName} isn't found`)
      } else {
        debug('Found coordinator %s', groupToJoin.Coordinator)
        return this.setAVTransportURI({ uri: `x-rincon:${groupToJoin.Coordinator}`, onlySetUri: true })
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
 * @returns {Boolean}
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
      const uri = 'x-rincon-queue:RINCON_' + info.MACAddress.replace(/:/g, '') + '0' + this.port + '#0'
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
 * Remove a range of tracks from the queue.
 * @param {number} startIndex Where to start removing the tracks, 1 for first item!
 * @param {number} numberOfTracks How many tracks to remove.
 */
Sonos.prototype.removeTracksFromQueue = async function (startIndex, numberOfTracks = 1) {
  debug('Sonos.removeTracksFromQueue(%s,%s)', startIndex, numberOfTracks)
  return this.avTransportService().RemoveTrackRangeFromQueue({
    InstanceID: 0,
    UpdateID: 0,
    StartingIndex: startIndex,
    NumberOfTracks: numberOfTracks
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
 * @returns {Boolean}
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
  return request(`http://${this.host}:${this.port}/xml/device_description.xml`)
    .then(response => response.data)
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
 * Get the CurrentZoneName
 * @returns {String}
 */
Sonos.prototype.getName = async function () {
  debug('Sonos.getName()')
  return this.getZoneAttrs().then(attrs => {
    return attrs.CurrentZoneName
  })
}

/**
 * Get Play Mode
 * @returns {String}
 */
Sonos.prototype.getPlayMode = async function () {
  debug('Sonos.getPlayMode()')
  return this.avTransportService().GetTransportSettings()
    .then(result => {
      return result.PlayMode
    })
}

const playmodes = ['NORMAL', 'REPEAT_ONE', 'REPEAT_ALL', 'SHUFFLE', 'SHUFFLE_NOREPEAT', 'SHUFFLE_REPEAT_ONE']
/**
 * Set Play Mode
 * @param  {String} playmode
 * @returns {Object}
 */
Sonos.prototype.setPlayMode = async function (playmode) {
  debug('Sonos.setPlayMode(%j)', playmode)
  playmode = playmode.toUpperCase()
  if (playmodes.indexOf(playmode) === -1) throw new Error('Invalid play mode: ' + playmode + ' available modes ' + playmodes.join(', '))
  return this.avTransportService().SetPlayMode(playmode)
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
 * Adjust volume
 * @param  {number} volumeAdjustment The relative volume adjustment
 * @param  {string} channel The channel you want to set, `Master` is default.
 */
Sonos.prototype.adjustVolume = async function (volumeAdjustment, channel = 'Master') {
  debug('Sonos.adjustVolume(%j)', volumeAdjustment)
  return this.renderingControlService().SetRelativeVolume(volumeAdjustment, channel)
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
 * @deprecated Doesn't work if you upgraded your system to Sonos v9.1
 * @returns {Object}
 */
Sonos.prototype.getTopology = async function () {
  debug('Sonos.getTopology()')
  return new Promise((resolve, reject) => {
    request(`http://${this.host}:${this.port}/status/topology`)
      .then(response => response.data)
      .then(Helpers.ParseXml)
      .then(result => {
        debug('getTopologyResult %j', result)
        const info = result.ZPSupportInfo

        if (!info) {
          resolve({ zones: [], mediaServers: [] })
          return
        }

        let zones = info.ZonePlayers.ZonePlayer
        if (!Array.isArray(zones)) {
          zones = [zones]
        }

        zones.forEach(zone => {
          zone.name = zone['_']
          delete zone['_']
        })

        const mediaServers = info.MediaServers.MediaServer
        mediaServers.forEach(s => {
          s.name = s['_']
          delete s['_']
        })

        resolve({ zones: zones, mediaServers: mediaServers })
      })
      .catch(reject)
  })
}
/**
 * Get Current Playback State
 * @returns {String} the current playback state
 */
Sonos.prototype.getCurrentState = async function () {
  debug('Sonos.currentState()')
  if (this._isSubscribed && this._state) return this._state
  return this.avTransportService().GetTransportInfo()
    .then(result => {
      return Helpers.TranslateState(result.CurrentTransportState)
    })
}

/**
 * Toggle the current playback, like the button. Currently only works for state `playing` or `paused`
 * @returns {Boolean}
 */
Sonos.prototype.togglePlayback = async function () {
  debug('Sonos.togglePlayback()')
  return this.getCurrentState()
    .then(state => {
      if (state === 'paused' || state === 'stopped') {
        return this.play()
      } else if (state === 'playing') {
        return this.pause()
      } else {
        debug('toggle playback doesn\'t support %s', state)
        return false
      }
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
Sonos.prototype.getFavoritesRadio = async function (favoriteRadioType, requestOptions = {}) {
  var radioTypes = {
    stations: 'R:0/0',
    shows: 'R:0/1'
  }

  var options = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: '',
    ObjectID: radioTypes[favoriteRadioType]
  }
  var opts = {}
  if (requestOptions.start !== undefined) opts.StartingIndex = requestOptions.start
  if (requestOptions.total !== undefined) opts.RequestedCount = requestOptions.total
  Object.assign(options, opts)
  return this.contentDirectoryService().GetResult(options)
}

Sonos.prototype.setSpotifyRegion = function (region) {
  this.options.spotify.region = region
}

/**
 * Get the current queue
 * @returns  {Object} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getQueue = async function () {
  var options = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '1000',
    SortCriteria: '',
    ObjectID: 'Q:0'
  }
  return this.contentDirectoryService().GetResult(options)
}

/**
 * Utility function which resolves a promise on an event
 * @param {String} eventName
 */
function asyncOnce (eventEmitter, eventName) {
  return new Promise((resolve, reject) => {
    eventEmitter.once(eventName, (m) => {
      resolve(m)
    })
  })
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
  debug('sonos.playNotification(%j)', options)
  const state = await this.getCurrentState()
  debug('Current state %j', state)
  const wasPlaying = (state === 'playing' || state === 'transitioning')
  debug('Was playing %j', wasPlaying)
  const wasListening = Listener.isListening()
  let volume = 0
  if (typeof options === 'object') {
    if (!options.uri) {
      throw new Error('options.uri is required.')
    }
    // Return false when not playing.
    if (!wasPlaying && options.onlyWhenPlaying === true) {
      return false
    }

    if (options.volume) {
      volume = await this.getVolume()
    }

    if (!options.metadata) {
      options.metadata = Helpers.GenerateMetadata(options.uri).metadata
    }
  }

  const mediaInfo = await this.avTransportService().GetMediaInfo()
  debug('Current mediaInfo %j', mediaInfo)
  const positionInfo = await this.avTransportService().GetPositionInfo()
  debug('Current positionInfo %j', positionInfo)
  await this.setAVTransportURI(options)
  if (volume > 0) await this.setVolume(options.volume)
  const self = this

  await asyncOnce(this, 'PlaybackStopped')

  debug('sonos.playNotification reverting back to before')
  if (volume > 0) await this.setVolume(volume)
  if (!wasListening) await Listener.stopListener()
  await self.setAVTransportURI({ uri: mediaInfo.CurrentURI, metadata: mediaInfo.CurrentURIMetaData, onlySetUri: true })

  // These statements can maybe be improved. See discussion on https://github.com/bencevans/node-sonos/pull/430
  if (positionInfo.Track && positionInfo.Track > 1 && mediaInfo.NrTracks > 1) {
    debug('Selecting track %j', positionInfo.Track)
    await self.selectTrack(positionInfo.Track).catch(reason => {
      debug('Reverting back track failed, happens for some muic services.')
    })
  }

  if (positionInfo.RelTime && positionInfo.TrackDuration !== '0:00:00') {
    debug('Setting back time to %j', positionInfo.RelTime)
    await self.avTransportService().Seek({ InstanceID: 0, Unit: 'REL_TIME', Target: positionInfo.RelTime }).catch(reason => {
      debug('Reverting back track time failed, happens for some muic services (radio or stream).')
    })
  }

  if (wasPlaying) await self.play()
  return true
}

/**
 * Reorder tracks in queue.
 * @param {number} startingIndex Index of the first track to be moved
 * @param {number} numberOfTracks How many tracks do we want to move
 * @param {number} insertBefore Index of place where the tracks should be moved to
 * @param {number} updateId Not sure what this means, just leave it at `0`
 * @returns {Boolean}
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
 * @returns {Object}
 */
Sonos.prototype.getSpotifyConnectInfo = async function () {
  const uri = `http://${this.host}:${this.port}/spotifyzc?action=getInfo`
  return request(uri).then(response => response.data).then(JSON.parse)
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

Sonos.prototype.zoneGroupTopologyService = function () {
  return new Services.ZoneGroupTopology(this.host, this.port)
}

// ----------------------------- End Services part

/**
 * Export
 */

module.exports.Sonos = Sonos
const deviceDiscovery = require('./deviceDiscovery')
module.exports.DeviceDiscovery = deviceDiscovery
/**
 * @deprecated Since 1.11.1
 * Please use Sonos.DeviceDiscovery or AsyncDeviceDiscovery
 */
module.exports.Search = deviceDiscovery
const asyncDeviceDiscovery = require('./asyncDeviceDiscovery')
module.exports.AsyncDeviceDiscovery = asyncDeviceDiscovery
module.exports.Helpers = Helpers
module.exports.Services = Services
module.exports.Listener = Listener
module.exports.SpotifyRegion = SpotifyRegion
