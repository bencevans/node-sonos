export = QueueService;
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
declare class QueueService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
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
    AddMultipleURIs(options?: {
        QueueID: number;
        UpdateID: number;
        ContainerURI: string;
        ContainerMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: boolean;
        NumberOfURIs: number;
        EnqueuedURIsAndMetaData: string;
    }): Promise<any>;
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
    AddURI(options?: {
        QueueID: number;
        UpdateID: number;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: boolean;
    }): Promise<any>;
    /**
     * AttachQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.QueueOwnerID
     * @returns {Promise<Object>} response object, with these properties `QueueID`, `QueueOwnerContext`
     */
    AttachQueue(options?: {
        QueueOwnerID: string;
    }): Promise<any>;
    /**
     * Backup
     * @returns {Promise<Boolean>} request succeeded
     */
    Backup(): Promise<boolean>;
    /**
     * Browse
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {number} options.StartingIndex
     * @param {number} options.RequestedCount
     * @returns {Promise<Object>} response object, with these properties `Result`, `NumberReturned`, `TotalMatches`, `UpdateID`
     */
    Browse(options?: {
        QueueID: number;
        StartingIndex: number;
        RequestedCount: number;
    }): Promise<any>;
    /**
     * CreateQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.QueueOwnerID
     * @param {string} options.QueueOwnerContext
     * @param {string} options.QueuePolicy
     * @returns {Promise<Object>} response object, with these properties `QueueID`
     */
    CreateQueue(options?: {
        QueueOwnerID: string;
        QueueOwnerContext: string;
        QueuePolicy: string;
    }): Promise<any>;
    /**
     * RemoveAllTracks
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {number} options.UpdateID
     * @returns {Promise<Object>} response object, with these properties `NewUpdateID`
     */
    RemoveAllTracks(options?: {
        QueueID: number;
        UpdateID: number;
    }): Promise<any>;
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
    RemoveTrackRange(options?: {
        QueueID: number;
        UpdateID: number;
        StartingIndex: number;
        NumberOfTracks: number;
    }): Promise<any>;
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
    ReorderTracks(options?: {
        QueueID: number;
        StartingIndex: number;
        NumberOfTracks: number;
        InsertBefore: number;
        UpdateID: number;
    }): Promise<any>;
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
    ReplaceAllTracks(options?: {
        QueueID: number;
        UpdateID: number;
        ContainerURI: string;
        ContainerMetaData: string;
        CurrentTrackIndex: number;
        NewCurrentTrackIndices: string;
        NumberOfURIs: number;
        EnqueuedURIsAndMetaData: string;
    }): Promise<any>;
    /**
     * SaveAsSonosPlaylist
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {string} options.Title
     * @param {string} options.ObjectID
     * @returns {Promise<Object>} response object, with these properties `AssignedObjectID`
     */
    SaveAsSonosPlaylist(options?: {
        QueueID: number;
        Title: string;
        ObjectID: string;
    }): Promise<any>;
}
import Service = require("./Service");
