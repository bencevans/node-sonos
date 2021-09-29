const Service = require('./Service')
/**
 * Sonos QueueService
 *
 * Modify and browse queues
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class QueueService
 * @extends {Service}
 */
class QueueService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'Queue'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/Queue/Control'
    this.eventSubURL = '/MediaRenderer/Queue/Event'
    this.SCPDURL = '/xml/Queue1.xml'
  }

  // #region actions
  /**
   * AddMultipleURIs
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.UpdateID
   * @param {string} options.ContainerURI
   * @param {string} options.ContainerMetaData
   * @param {number} options.DesiredFirstTrackNumberEnqueued
   * @param {boolean} options.EnqueueAsNext
   * @param {number} options.NumberOfURIs
   * @param {string} options.EnqueuedURIsAndMetaData
   * @returns {Promise<Object>} response object, with these properties `FirstTrackNumberEnqueued`, `NumTracksAdded`, `NewQueueLength`, `NewUpdateID`
   */
  async AddMultipleURIs (options) { return this._request('AddMultipleURIs', options) }

  /**
   * AddURI
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.UpdateID
   * @param {string} options.EnqueuedURI
   * @param {string} options.EnqueuedURIMetaData
   * @param {number} options.DesiredFirstTrackNumberEnqueued
   * @param {boolean} options.EnqueueAsNext
   * @returns {Promise<Object>} response object, with these properties `FirstTrackNumberEnqueued`, `NumTracksAdded`, `NewQueueLength`, `NewUpdateID`
   */
  async AddURI (options) { return this._request('AddURI', options) }

  /**
   * AttachQueue
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.QueueOwnerID
   * @returns {Promise<Object>} response object, with these properties `QueueID`, `QueueOwnerContext`
   */
  async AttachQueue (options) { return this._request('AttachQueue', options) }

  /**
   * Backup
   * @returns {Promise<Boolean>} request succeeded
   */
  async Backup () { return this._request('Backup') }

  /**
   * Browse
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.StartingIndex
   * @param {number} options.RequestedCount
   * @returns {Promise<Object>} response object, with these properties `Result`, `NumberReturned`, `TotalMatches`, `UpdateID`
   */
  async Browse (options) { return this._request('Browse', options) }

  /**
   * CreateQueue
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.QueueOwnerID
   * @param {string} options.QueueOwnerContext
   * @param {string} options.QueuePolicy
   * @returns {Promise<Object>} response object, with these properties `QueueID`
   */
  async CreateQueue (options) { return this._request('CreateQueue', options) }

  /**
   * RemoveAllTracks
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.UpdateID
   * @returns {Promise<Object>} response object, with these properties `NewUpdateID`
   */
  async RemoveAllTracks (options) { return this._request('RemoveAllTracks', options) }

  /**
   * RemoveTrackRange
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.UpdateID
   * @param {number} options.StartingIndex
   * @param {number} options.NumberOfTracks
   * @returns {Promise<Object>} response object, with these properties `NewUpdateID`
   */
  async RemoveTrackRange (options) { return this._request('RemoveTrackRange', options) }

  /**
   * ReorderTracks
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.StartingIndex
   * @param {number} options.NumberOfTracks
   * @param {number} options.InsertBefore
   * @param {number} options.UpdateID
   * @returns {Promise<Object>} response object, with these properties `NewUpdateID`
   */
  async ReorderTracks (options) { return this._request('ReorderTracks', options) }

  /**
   * ReplaceAllTracks
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {number} options.UpdateID
   * @param {string} options.ContainerURI
   * @param {string} options.ContainerMetaData
   * @param {number} options.CurrentTrackIndex
   * @param {string} options.NewCurrentTrackIndices
   * @param {number} options.NumberOfURIs
   * @param {string} options.EnqueuedURIsAndMetaData
   * @returns {Promise<Object>} response object, with these properties `NewQueueLength`, `NewUpdateID`
   */
  async ReplaceAllTracks (options) { return this._request('ReplaceAllTracks', options) }

  /**
   * SaveAsSonosPlaylist
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.QueueID
   * @param {string} options.Title
   * @param {string} options.ObjectID
   * @returns {Promise<Object>} response object, with these properties `AssignedObjectID`
   */
  async SaveAsSonosPlaylist (options) { return this._request('SaveAsSonosPlaylist', options) }
  // #endregion
}

module.exports = QueueService
