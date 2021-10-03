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
     * @returns {Promise<{ FirstTrackNumberEnqueued: number, NumTracksAdded: number, NewQueueLength: number, NewUpdateID: number}>} response object.
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
    }): Promise<{
        FirstTrackNumberEnqueued: number;
        NumTracksAdded: number;
        NewQueueLength: number;
        NewUpdateID: number;
    }>;
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
     * @returns {Promise<{ FirstTrackNumberEnqueued: number, NumTracksAdded: number, NewQueueLength: number, NewUpdateID: number}>} response object.
     */
    AddURI(options?: {
        QueueID: number;
        UpdateID: number;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: boolean;
    }): Promise<{
        FirstTrackNumberEnqueued: number;
        NumTracksAdded: number;
        NewQueueLength: number;
        NewUpdateID: number;
    }>;
    /**
     * AttachQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.QueueOwnerID
     * @returns {Promise<{ QueueID: number, QueueOwnerContext: string}>} response object.
     */
    AttachQueue(options?: {
        QueueOwnerID: string;
    }): Promise<{
        QueueID: number;
        QueueOwnerContext: string;
    }>;
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
     * @returns {Promise<{ Result: string, NumberReturned: number, TotalMatches: number, UpdateID: number}>} response object.
     */
    Browse(options?: {
        QueueID: number;
        StartingIndex: number;
        RequestedCount: number;
    }): Promise<{
        Result: string;
        NumberReturned: number;
        TotalMatches: number;
        UpdateID: number;
    }>;
    /**
     * CreateQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.QueueOwnerID
     * @param {string} options.QueueOwnerContext
     * @param {string} options.QueuePolicy
     * @returns {Promise<{ QueueID: number}>} response object.
     */
    CreateQueue(options?: {
        QueueOwnerID: string;
        QueueOwnerContext: string;
        QueuePolicy: string;
    }): Promise<{
        QueueID: number;
    }>;
    /**
     * RemoveAllTracks
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {number} options.UpdateID
     * @returns {Promise<{ NewUpdateID: number}>} response object.
     */
    RemoveAllTracks(options?: {
        QueueID: number;
        UpdateID: number;
    }): Promise<{
        NewUpdateID: number;
    }>;
    /**
     * RemoveTrackRange
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {number} options.UpdateID
     * @param {number} options.StartingIndex
     * @param {number} options.NumberOfTracks
     * @returns {Promise<{ NewUpdateID: number}>} response object.
     */
    RemoveTrackRange(options?: {
        QueueID: number;
        UpdateID: number;
        StartingIndex: number;
        NumberOfTracks: number;
    }): Promise<{
        NewUpdateID: number;
    }>;
    /**
     * ReorderTracks
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {number} options.StartingIndex
     * @param {number} options.NumberOfTracks
     * @param {number} options.InsertBefore
     * @param {number} options.UpdateID
     * @returns {Promise<{ NewUpdateID: number}>} response object.
     */
    ReorderTracks(options?: {
        QueueID: number;
        StartingIndex: number;
        NumberOfTracks: number;
        InsertBefore: number;
        UpdateID: number;
    }): Promise<{
        NewUpdateID: number;
    }>;
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
     * @returns {Promise<{ NewQueueLength: number, NewUpdateID: number}>} response object.
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
    }): Promise<{
        NewQueueLength: number;
        NewUpdateID: number;
    }>;
    /**
     * SaveAsSonosPlaylist
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.QueueID
     * @param {string} options.Title
     * @param {string} options.ObjectID
     * @returns {Promise<{ AssignedObjectID: string}>} response object.
     */
    SaveAsSonosPlaylist(options?: {
        QueueID: number;
        Title: string;
        ObjectID: string;
    }): Promise<{
        AssignedObjectID: string;
    }>;
}
import Service = require("./Service");
