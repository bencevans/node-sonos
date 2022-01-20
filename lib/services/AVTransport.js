/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')
const Helpers = require('../helpers')

/**
 * Create a new instance of AVTransport
 * @class AVTransport
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */

class AVTransport extends Service {
  constructor (host, port) {
    super()
    this.name = 'AVTransport'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/AVTransport/Control'
    this.eventSubURL = '/MediaRenderer/AVTransport/Event'
    this.SCPDURL = '/xml/AVTransport1.xml'
  }

  /**
   * Set the Transport URI
   * @param {object} options Object with required options
   * @param {number} options.InstanceID The instance you want to control is always `0`
   * @param {string} options.CurrentURI The new URI you wish to set.
   * @param {string} options.CurrentURIMetaData The metadata of the uri you wish to set.
   * @returns {Object} Parsed response data.
   */
  async SetAVTransportURI (options) { return this._request('SetAVTransportURI', options) }

  /**
   * Add an URI to the queue
   * @param {object} options The the required properties
   * @param {number} options.InstanceID The instance you want to control is always `0`
   * @param {number} options.EnqueuedURI The URI of the track you want to add
   * @param {number} options.EnqueuedURIMetaData The Metadata of the track you wish to add, see `Helpers.GenerateMetadata`
   * @param {number} options.DesiredFirstTrackNumberEnqueued The position in the queue
   * @param {number} options.EnqueueAsNext To Queue this item as the next item set to `1`
   * @returns {Object} Parsed response data.
   */
  async AddURIToQueue (options) { return this._request('AddURIToQueue', options) }

  async AddURIToSavedQueue (options) { return this._request('AddURIToSavedQueue', options) }

  async AddMultipleURIsToQueue (options) { return this._request('AddMultipleURIsToQueue', options) }

  /**
   * Reorder tracks in queue
   * @param {object} options All the required options
   * @param {number} options.InstanceID The instance you want to edit is always `0`
   * @param {number} options.UpdateID The update id, not a clue what this means. Just specify `0`
   * @param {number} options.StartingIndex The index of the first song you want to move.
   * @param {number} options.NumberOfTracks How many tracks do you want to move?
   * @param {number} options.InsertBefore Where should these tracks be inserted?
   * @returns {Object} Parsed response data.
   */
  async ReorderTracksInQueue (options) { return this._request('ReorderTracksInQueue', options) }

  async ReorderTracksInSavedQueue (options) { return this._request('ReorderTracksInSavedQueue', options) }

  /**
   * Remove a single track from the queue
   * @param {object} options Object with required options
   * @param {number} options.InstanceID The instance you want to control is always `0`
   * @param {string} options.ObjectID The object to remove
   * @param {string} options.UpdateID The update id, not a clue what this means. Just specify `0`
   * @returns {Object} Parsed response data.
   */
  async RemoveTrackFromQueue (options) { return this._request('RemoveTrackFromQueue', options) }

  /**
   * Remove a range of tracks from the queue
   * @param {object} options Object with required options
   * @param {number} options.InstanceID The instance you want to control is always `0`
   * @param {number} options.UpdateID The update id, not a clue what this means. Just specify `0`
   * @param {number} options.StartingIndex Index of the first song to remove
   * @param {number} options.NumberOfTracks How many tracks to remove
   * @returns {Object} Parsed response data.
   */
  async RemoveTrackRangeFromQueue (options) { return this._request('RemoveTrackRangeFromQueue', options) }

  async RemoveAllTracksFromQueue () { return this._request('RemoveAllTracksFromQueue', { InstanceID: 0 }) }

  async SaveQueue (options) { return this._request('SaveQueue', options) }

  async CreateSavedQueue (title) { return this._request('CreateSavedQueue', { InstanceID: 0, Title: title, EnqueuedURI: '', EnqueuedURIMetaData: '' }) }

  async BackupQueue (options) { return this._request('BackupQueue', options) }

  async GetMediaInfo () { return this._request('GetMediaInfo', { InstanceID: 0 }) }

  async GetTransportInfo () { return this._request('GetTransportInfo', { InstanceID: 0 }) }

  async GetPositionInfo () {
    return this._request('GetPositionInfo', { InstanceID: 0 })
      .then(result => {
        result.Track = parseInt(result.Track)
        return result
      })
  }

  async GetDeviceCapabilities () { return this._request('GetDeviceCapabilities', { InstanceID: 0 }) }

  async GetTransportSettings () { return this._request('GetTransportSettings', { InstanceID: 0 }) }

  async GetCrossfadeMode () { return this._request('GetCrossfadeMode', { InstanceID: 0 }) }

  async Stop () { return this._request('Stop', { InstanceID: 0 }) }

  async Play () { return this._request('Play', { InstanceID: 0, Speed: 1 }) }

  async Pause () { return this._request('Pause', { InstanceID: 0 }) }

  /**
   * Skip to other track or time
   * @param {object} options Object with required options
   * @param {number} options.InstanceID The instance you want to control is always `0`
   * @param {number} options.Unit One of these `TRACK_NR`, `REL_TIME`, `TIME_DELTA`
   * @param {number} options.Target Skip to what track number, relative time as hh:mm:ss, or ?
   */
  async Seek (options) { return this._request('Seek', options) }

  async Next () { return this._request('Next', { InstanceID: 0 }) }

  async NextProgrammedRadioTracks () { return this._request('NextProgrammedRadioTracks') }

  async Previous () { return this._request('Previous', { InstanceID: 0 }) }

  async NextSection (options) { return this._request('NextSection', options) }

  async PreviousSection (options) { return this._request('PreviousSection', options) }

  /**
   * Set the new playmode
   * @param {string} playmode One of the following `NORMAL` `REPEAT_ALL` `SHUFFLE` `SHUFFLE_NOREPEAT`
   * @returns {Object} Parsed response data.
   */
  async SetPlayMode (playmode) { return this._request('SetPlayMode', { InstanceID: 0, NewPlayMode: playmode }) }

  async SetCrossfadeMode (options) { return this._request('SetCrossfadeMode', options) }

  async NotifyDeletedURI (options) { return this._request('NotifyDeletedURI', options) }

  async GetCurrentTransportActions () { return this._request('GetCurrentTransportActions', { InstanceID: 0 }) }

  async BecomeCoordinatorOfStandaloneGroup () { return this._request('BecomeCoordinatorOfStandaloneGroup', { InstanceID: 0 }) }

  async DelegateGroupCoordinationTo (options) { return this._request('DelegateGroupCoordinationTo', options) }

  async BecomeGroupCoordinator (options) { return this._request('BecomeGroupCoordinator', options) }

  async BecomeGroupCoordinatorAndSource (options) { return this._request('BecomeGroupCoordinatorAndSource', options) }

  /**
   * Configure a sleeptimer.
   * @param {string} duration the duration as 'ISO8601Time', needs sample!
   * @returns {Object} Parsed response data.
   */
  async ConfigureSleepTimer (duration) { return this._request('ConfigureSleepTimer', { InstanceID: 0, NewSleepTimerDuration: duration }) }

  async GetRemainingSleepTimerDuration () { return this._request('GetRemainingSleepTimerDuration', { InstanceID: 0 }) }

  async RunAlarm (options) { return this._request('RunAlarm', options) }

  async StartAutoplay (options) { return this._request('StartAutoplay', options) }

  async GetRunningAlarmProperties (options) { return this._request('GetRunningAlarmProperties', { InstanceID: 0 }) }

  /**
   * Snooze the current running alarm for a number of minutes.
   * @param {string} duration The duration, as 'ISO8601Time', needs sample!
   * @returns {Object} Parsed response data.
   */
  async SnoozeAlarm (duration) { return this._request('SnoozeAlarm', { InstanceID: 0, Duration: duration }) }

  /**
   * Get information about the current track, parsed version of `GetPositionInfo()`
   * @returns {Object} The current playing track
   */
  async CurrentTrack () {
    return this.GetPositionInfo()
      .then(async result => {
        const position = Helpers.TimeToSeconds(result.RelTime)
        const duration = Helpers.TimeToSeconds(result.TrackDuration)
        const trackUri = result.TrackURI || null
        const queuePosition = parseInt(result.Track)
        if (result.TrackMetaData && result.TrackMetaData !== 'NOT_IMPLEMENTED') { // There is some metadata, lets parse it.
          var metadata = await Helpers.ParseXml(result.TrackMetaData)
          const track = Helpers.ParseDIDL(metadata)
          track.position = position
          track.duration = duration
          try { 
		    track.albumArtURL = !track.albumArtURI ? null
              : track.albumArtURI.startsWith('http') ? track.albumArtURI
                : 'http://' + this.host + ':' + this.port + track.albumArtURI
            if (trackUri) track.uri = trackUri
          } catch(e) {}
          track.queuePosition = queuePosition
          return track
        } else { // No metadata.
          return { position: position, duration: duration, queuePosition: queuePosition, uri: trackUri }
        }
      })
  }
}

module.exports = AVTransport
