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
const EventEmitter = require('events').EventEmitter
const request = require('axios')
const debug = require('debug')('sonos:main')
const Listener = require('./events/adv-listener')
const Helpers = require('./helpers')

// All the services
const Services = {
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

const GeneratedServices = require('./services/all-services')

const SpotifyRegion = {
  EU: '2311',
  US: '3079'
}

const playmodes = ['NORMAL', 'REPEAT_ONE', 'REPEAT_ALL', 'SHUFFLE', 'SHUFFLE_NOREPEAT', 'SHUFFLE_REPEAT_ONE']

/**
 * Utility function which resolves a promise on an event
 * @param {EventEmitter} eventEmitter EventEmitter to subscribe for an event once
 * @param {String} eventName Event to subscribe to
 */
function asyncOnce (eventEmitter, eventName) {
  return new Promise((resolve, reject) => {
    eventEmitter.once(eventName, (m) => {
      resolve(m)
    })
  })
}

/**
 * Create an instance of Sonos
 * @class Sonos
 * @param {String} host IP/DNS
 * @param {Number} port port, defaults to `1400`
 * @returns {Sonos}
 */
class Sonos extends EventEmitter {
  constructor (host, port, options) {
    super()

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
    const self = this
    const implicitListen = async function (event, listener) {
      if (event === 'newListener') return
      self.removeListener('newListener', implicitListen)
      return Listener.subscribeTo(self).catch(err => {
        debug('Error subscribing to listener %j', err)
      })
    }
    this.on('newListener', implicitListen)

    this._isSubscribed = undefined
    this._state = undefined
    this._mute = undefined
    this._volume = undefined
    // Maybe stop the eventListener once last listener is removed?
  }

  /**
   * Get Music Library Information
   * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
   * @param  {Object}   options     Optional - default {start: 0, total: 100}
   * @returns {Promise<Object>}  {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getMusicLibrary (searchType, options) {
    return this.searchMusicLibrary(searchType, null, options)
  }

  /**
   * Get Music Library Information
   * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
   * @param  {String}   searchTerm  Optional - search term to search for
   * @param  {Object}   requestOptions     Optional - default {start: 0, total: 100}
   * @param  {String}   separator   Optional - default is colon. `:` or `/`
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async searchMusicLibrary (searchType, searchTerm, requestOptions = {}, separator = ':') {
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
    const defaultOptions = {
      BrowseFlag: 'BrowseDirectChildren',
      Filter: '*',
      StartingIndex: '0',
      RequestedCount: '100',
      SortCriteria: ''
    }
    let searches = `${searchTypes[searchType]}${separator}`

    if (searchTerm && searchTerm !== '') {
      searches = searches.concat(searchType === 'share' ? searchTerm : encodeURIComponent(searchTerm))
    }

    let opts = {
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
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getPlaylist (playlistId, requestOptions = {}) {
    return this.searchMusicLibrary('sonos_playlists', playlistId, requestOptions)
  }

  /**
   * Create a new sonos playlist
   * @param {String}  title   Name of the playlist
   * @returns {Promise<Object>} { NumTracksAdded: 0, NewQueueLength: 0, NewUpdateID: 0, AssignedObjectID: 'SQ:3' }
   */
  async createPlaylist (title) {
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
   * @param {Number}  playlistId   Sonos id of the playlist
   * @returns {Promise<Boolean>} Playlist deleted
   */
  async deletePlaylist (playlistId) {
    debug('Sonos.deletePlaylist()')
    return this.contentDirectoryService().DestroyObject({ ObjectID: `SQ:${playlistId}` }).then(() => { return true }, () => { return false })
  }

  /**
   * Add uri to sonos playlist
   * @param {String}  playlistId   Sonos id of the playlist
   * @param {String}  uri   Uri to add to the playlist
   * @returns {Promise<Object>} { NumTracksAdded: 1, NewQueueLength: 2, NewUpdateID: 2 }
   */
  async addToPlaylist (playlistId, uri) {
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
   * @param {String}  playlistId   Sonos id of the playlist
   * @param {String}  index   Index of song to remove
   * @returns {Promise<Object>} { QueueLengthChange: -1, NewQueueLength: 2, NewUpdateID: 2 }
   */
  async removeFromPlaylist (playlistId, index) {
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
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getFavorites () {
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
   * @returns {Promise<Object>} All the info of the current track
   */
  async currentTrack () {
    debug('Sonos.currentTrack()')
    return this.avTransportService().CurrentTrack()
  }

  /**
   * Get Current Volume
   * @returns {Promise<Number>} The current volume
   */
  async getVolume () {
    debug('Sonos.getVolume()')
    if (this._isSubscribed && this._volume) return this._volume
    return this.renderingControlService().GetVolume()
  }

  /**
   * Get Current Muted
   * @returns {Promise<Boolean>}
   */
  async getMuted () {
    debug('Sonos.getMuted()')
    if (this._isSubscribed && this._mute) return this._mute
    return this.renderingControlService().GetMute()
  }

  /**
   * Resumes Queue or Plays Provided URI
   * @param  {String|Object}   options      Optional - URI to a Audio Stream or Object with play options
   * @returns {Promise<Boolean>} Started playing?
   */
  async play (options) {
    debug('Sonos.play(%j)', options)
    if (!options) {
      await this.avTransportService().Play()
      return true
    } else {
      const result = await this.queue(options)
      await this.selectQueue()
      await this.selectTrack(result.FirstTrackNumberEnqueued)
      return this.avTransportService().Play()
        .then(result => { return true })
    }
  }

  /**
   * Plays a uri directly (the queue stays the same)
   * @param  {String|Object}   options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
   * @returns {Promise<Boolean>}
   */
  async setAVTransportURI (options) {
    debug('Sonos.setAVTransportURI(%j)', options)

    if (typeof options !== 'string' && typeof options !== 'object') {
      throw new Error('Options should be an object or a string')
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
      throw new Error('Error with uri')
    }
  }

  /**
   * Stop What's Playing
   * @returns {Promise<Boolean>}
   */
  async stop () {
    debug('Sonos.stop()')
    return this.avTransportService().Stop().then(result => { return true })
  }

  /**
  * Get all the groups, replaces some functionality of 'getTopology()'
  */
  async getAllGroups () {
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

          const uri = new URL(coordinator.Location)
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
   * @returns {Promise<Boolean>}
   */
  async becomeCoordinatorOfStandaloneGroup () {
    debug('Sonos.becomeCoordinatorOfStandaloneGroup()')
    return this.avTransportService().BecomeCoordinatorOfStandaloneGroup().then(result => { return true })
  }

  /**
   * Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)
   * @returns {Promise<Boolean>}
   */
  async leaveGroup () {
    return this.becomeCoordinatorOfStandaloneGroup()
  }

  /**
   * Join an other device by name
   * @param  {String} otherDeviceName The name of de device you want to join, doesn't matter if that isn't the coordinator
   * @returns {Promise<Boolean>}
   */
  async joinGroup (otherDeviceName) {
    debug('Sonos.joinGroup(%j)', otherDeviceName)

    return this.getAllGroups()
      .then(groups => {
        const groupToJoin = groups.find(group =>
          group.ZoneGroupMember.some(member =>
            member.ZoneName.toLowerCase() === otherDeviceName.toLowerCase()))

        if (!groupToJoin) {
          throw new Error(`Device with name ${otherDeviceName} isn't found`)
        } else {
          debug('Found coordinator %s', groupToJoin.Coordinator)
          return this.setAVTransportURI({ uri: `x-rincon:${groupToJoin.Coordinator}`, onlySetUri: true })
        }
      })
  }

  /**
   * Pause Current Queue
   * @returns {Promise<Boolean>}
   */
  async pause () {
    debug('Sonos.pause()')
    return this.avTransportService().Pause().then(result => { return true })
  }

  /**
   * Seek in the current track
   * @param  {Number} seconds jump to x seconds.
   * @returns {Promise<Boolean>}
   */
  async seek (seconds) {
    debug('Sonos.seek()')
    const hh = Math.floor(seconds / 3600)
    const mm = Math.floor((seconds - (hh * 3600)) / 60)
    const ss = seconds - ((hh * 3600) + (mm * 60))
    return this.avTransportService().Seek({
      InstanceID: 0,
      Unit: 'REL_TIME',
      Target: hh.toString().padStart(2, '0') + ':' + mm.toString().padStart(2, '0') + ':' + ss.toString().padStart(2, '0')
    }).then(result => { return true })
  }

  /**
   * Select specific track in queue
   * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
   * @returns {Promise<Boolean>}
   */
  async selectTrack (trackNr) {
    debug('Sonos.selectTrack(%j)', trackNr)
    return this.avTransportService().Seek({
      InstanceID: 0,
      Unit: 'TRACK_NR',
      Target: trackNr
    }).then(result => { return true })
  }

  /**
   * Play next in queue
   * @returns {Promise<Boolean>}
   */
  async next () {
    debug('Sonos.next()')
    return this.avTransportService().Next().then(result => { return true })
  }

  /**
   * Play previous in queue
   * @returns {Promise<Boolean>}
   */
  async previous () {
    debug('Sonos.previous()')
    return this.avTransportService().Previous().then(result => { return true })
  }

  /**
   * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
   * @returns {Promise<Boolean>} success
   */
  async selectQueue () {
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
   * @returns {Promise<Boolean>}
   */
  async playTuneinRadio (stationId, stationTitle) {
    debug('Sonos.playTuneinRadio(%j, %j)', stationId, stationTitle)

    const options = Helpers.GenerateMetadata('radio:' + stationId, stationTitle)
    return this.setAVTransportURI(options)
  }

  /**
   * Plays Spotify radio based on artist uri
   * @param  {String}   artistId  Spotify artist id
   * @returns {Promise<Boolean>}
   */
  async playSpotifyRadio (artistId, artistName) {
    debug('Sonos.playSpotifyRadio(%j, %j)', artistId, artistName)
    const options = Helpers.GenerateMetadata('spotify:artistRadio:' + artistId, artistName, this.options.spotify.region)
    return this.setAVTransportURI(options)
  }

  /**
   * Add a song to the queue.
   * @param  {String|Object}   options  Uri with audio stream of object with `uri` and `metadata`
   * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
   *                                    defaults to end of queue, 0 to explicitly set end of queue)
   * @returns {Promise<Object>} Some info about the last queued file.
   */
  async queue (options, positionInQueue = 0) {
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
  async removeTracksFromQueue (startIndex, numberOfTracks = 1) {
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
   * @returns {Promise<Object>}
   */
  async flush () {
    debug('Sonos.flush()')
    return this.avTransportService().RemoveAllTracksFromQueue()
  }

  /**
   * Get the LED State
   * @returns {Promise<String>} state is a string, "On" or "Off"
   */
  async getLEDState () {
    debug('Sonos.getLEDState()')
    return this.devicePropertiesService().GetLEDState()
  }

  /**
   * Set the LED State
   * @param  {String}   newState           "On"/"Off"
   * @returns {Promise<Boolean>}
   */
  async setLEDState (newState) {
    debug('Sonos.setLEDState(%j)', newState)
    return this.devicePropertiesService().SetLEDState(newState)
  }

  /**
   * Get Zone Info
   * @returns {Promise<Object>}
   */
  async getZoneInfo () {
    debug('Sonos.getZoneInfo()')
    return this.devicePropertiesService().GetZoneInfo()
  }

  /**
   * Get Zone Attributes
   * @returns {Promise<Object>}
   */
  async getZoneAttrs () {
    debug('Sonos.getZoneAttrs()')
    return this.devicePropertiesService().GetZoneAttributes()
  }

  /**
   * Get Information provided by /xml/device_description.xml
   * @returns {Promise<Object>}
   */
  async deviceDescription () {
    debug('Sonos.deviceDescription()')
    return request(`http://${this.host}:${this.port}/xml/device_description.xml`)
      .then(response => response.data)
      .then(Helpers.SanitizeDeviceDescriptionXml)
      .then(Helpers.ParseXml)
      .then(result => {
        return result.root.device
      })
  }

  /**
   * Set Name
   * @param  {String}   name
   * @returns {Promise<Object>}
   */
  async setName (name) {
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
   * @returns {Promise<String>}
   */
  async getName () {
    debug('Sonos.getName()')
    return this.getZoneAttrs().then(attrs => {
      return attrs.CurrentZoneName
    })
  }

  /**
   * Get Play Mode
   * @returns {Promise<String>}
   */
  async getPlayMode () {
    debug('Sonos.getPlayMode()')
    return this.avTransportService().GetTransportSettings()
      .then(result => {
        return result.PlayMode
      })
  }

  /**
   * Set Play Mode
   * @param  {String} playmode
   * @returns {Promise<Object>}
   */
  async setPlayMode (playmode) {
    debug('Sonos.setPlayMode(%j)', playmode)
    playmode = playmode.toUpperCase()
    if (playmodes.indexOf(playmode) === -1) throw new Error('Invalid play mode: ' + playmode + ' available modes ' + playmodes.join(', '))
    return this.avTransportService().SetPlayMode(playmode)
  }

  /**
   * Set Volume
   * @param  {number}   volume 0..100
   * @param  {string}   channel What channel to change, `Master` is default.
   * @returns {Promise<Object>}
   */
  async setVolume (volume, channel = 'Master') {
    debug('Sonos.setVolume(%j)', volume)
    return this.renderingControlService().SetVolume(volume, channel)
  }

  /**
   * Adjust volume
   * @param  {number} volumeAdjustment The relative volume adjustment
   * @param  {string} channel The channel you want to set, `Master` is default.
   */
  async adjustVolume (volumeAdjustment, channel = 'Master') {
    debug('Sonos.adjustVolume(%j)', volumeAdjustment)
    return this.renderingControlService().SetRelativeVolume(volumeAdjustment, channel)
  }

  /**
   * Configure Sleep Timer
   * @param  {String} sleepTimerDuration
   * @returns {Promise<Object>}
   */
  async configureSleepTimer (sleepTimerDuration) {
    debug('Sonos.sleepTimerDuration(%j)', sleepTimerDuration)
    return this.avTransportService().ConfigureSleepTimer(sleepTimerDuration)
  }

  /**
   * Set Muted
   * @param  {Boolean}  muted
   * @param  {string}   channel What channel to change, `Master` is default.
   * @returns {Promise<Object>}
   */
  async setMuted (muted, channel = 'Master') {
    debug('Sonos.setMuted(%j)', muted)
    if (typeof muted === 'string') muted = !!parseInt(muted, 10)
    return this.renderingControlService().SetMute(muted, channel)
  }

  /**
   * Get device balance as number from -100 (full left) to +100 (full right), where 0 is left and right equal
   * @returns {Promise}
   */
  async getBalance () {
    return (
      (await this.renderingControlService().GetVolume('RF')) -
      (await this.renderingControlService().GetVolume('LF'))
    )
  }

  /**
   * Set device balance
   * @param {Number} balance  from -100 (full left) to +100 (full right), where 0 is left and right equal
   * @returns {Promise}
   */
  async setBalance (balance) {
    let rightVolume = 100
    let leftVolume = 100

    if (balance > 0) {
      leftVolume = 100 - balance
    } else if (balance < 0) {
      rightVolume = 100 - balance * -1
    }

    await this.renderingControlService().SetVolume(leftVolume, 'LF')
    await this.renderingControlService().SetVolume(rightVolume, 'RF')
  }

  /**
   * Get Zones in contact with current Zone with Group Data
   * @deprecated Doesn't work if you upgraded your system to Sonos v9.1
   * @returns {Promise<Object>}
   */
  async getTopology () {
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
            zone.name = zone._
            delete zone._
          })

          const mediaServers = info.MediaServers.MediaServer
          mediaServers.forEach(s => {
            s.name = s._
            delete s._
          })

          resolve({ zones: zones, mediaServers: mediaServers })
        })
        .catch(reject)
    })
  }

  /**
   * Get Current Playback State
   * @returns {Promise<String>} the current playback state
   */
  async getCurrentState () {
    debug('Sonos.currentState()')
    if (this._isSubscribed && this._state) return this._state
    return this.avTransportService().GetTransportInfo()
      .then(result => {
        return Helpers.TranslateState(result.CurrentTransportState)
      })
  }

  /**
   * Toggle the current playback, like the button. Currently only works for state `playing` or `paused`
   * @returns {Promise<Boolean>}
   */
  async togglePlayback () {
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
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getFavoritesRadioStations (options) {
    return this.getFavoritesRadio('stations', options)
  }

  /**
   * Get Favorites Radio Shows
   * @param  {Object}   options     Optional - default {start: 0, total: 100}
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getFavoritesRadioShows (options) {
    return this.getFavoritesRadio('shows', options)
  }

  /**
   * Get Favorites Radio for a given radio type
   * @param  {String}   favoriteRadioType  Choice - stations, shows
   * @param  {Object}   requestOptions     Optional - default {start: 0, total: 100}
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getFavoritesRadio (favoriteRadioType, requestOptions = {}) {
    const radioTypes = {
      stations: 'R:0/0',
      shows: 'R:0/1'
    }

    const options = {
      BrowseFlag: 'BrowseDirectChildren',
      Filter: '*',
      StartingIndex: '0',
      RequestedCount: '100',
      SortCriteria: '',
      ObjectID: radioTypes[favoriteRadioType]
    }
    const opts = {}
    if (requestOptions.start !== undefined) opts.StartingIndex = requestOptions.start
    if (requestOptions.total !== undefined) opts.RequestedCount = requestOptions.total
    Object.assign(options, opts)
    return this.contentDirectoryService().GetResult(options)
  }

  setSpotifyRegion (region) {
    this.options.spotify.region = region
  }

  /**
   * Get the current queue
   * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
  async getQueue () {
    const options = {
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
   * Play uri and restore last state
   * @param  {Object}  options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
   * @param  {String}         options.uri The URI of the stream
   * @param  {String}         options.metadata The metadata of the stream see `Helpers.GenerateMetadata`
   * @param  {Boolean}        options.onlyWhenPlaying Only play this notification on players currently 'playing'
   * @param  {Number}         options.volume The volume used for the notification.
   * @returns {Promise<Boolean>}       Did the notification play? Only returns when finished reverting to old play settings.
   */
  async playNotification (options) {
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
   * @returns {Promise<Boolean>}
   */
  async reorderTracksInQueue (startingIndex, numberOfTracks, insertBefore, updateId = 0) {
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
   * @returns {Promise<Object>}
   */
  async getSpotifyConnectInfo () {
    const uri = `http://${this.host}:${this.port}/spotifyzc?action=getInfo`
    const resp = await request(uri)
    return resp.data
  }

  /**
   * Get device spicific ZPInfo, will return empty object if failed for some reason
   * This is useful for extracting the HouseholdControlID, Mac Address, serial number etc
   * @returns {Promise<Object>}
   */
  async getZPInfo () {
    try {
      const uri = `http://${this.host}:${this.port}/status/zp`
      const response = await request(uri)
      const data = await Helpers.ParseXml(response.data)
      return data.ZPSupportInfo.ZPInfo
    } catch (e) {
      debug('Error getting ZPInfo %j', e)
      return {}
    }
  }

  // ----------------------------- Services part

  alarmClockService () {
    return new Services.AlarmClock(this.host, this.port)
  }

  avTransportService () {
    return new Services.AVTransport(this.host, this.port)
  }

  contentDirectoryService () {
    return new Services.ContentDirectory(this.host, this.port)
  }

  devicePropertiesService () {
    return new Services.DeviceProperties(this.host, this.port)
  }

  groupRenderingControlService () {
    return new Services.GroupRenderingControl(this.host, this.port)
  }

  renderingControlService () {
    return new Services.RenderingControl(this.host, this.port)
  }

  zoneGroupTopologyService () {
    return new Services.ZoneGroupTopology(this.host, this.port)
  }

  musicServices () {
    return new Services.MusicServices(this.host, this.port)
  }

  /**
   * Get all services available to sonos.
   */
  get generatedServices () {
    return new GeneratedServices.AllServices(this.host, this.port)
  }
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
module.exports.GeneratedServices = GeneratedServices
module.exports.Listener = Listener
module.exports.SpotifyRegion = SpotifyRegion
