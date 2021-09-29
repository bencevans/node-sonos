export = AVTransport;
/**
 * Create a new instance of AVTransport
 * @class AVTransport
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class AVTransport extends Service {
    constructor(host: any, port: any);
    /**
     * Set the Transport URI
     * @param {object} options Object with required options
     * @param {number} options.InstanceID The instance you want to control is always `0`
     * @param {string} options.CurrentURI The new URI you wish to set.
     * @param {string} options.CurrentURIMetaData The metadata of the uri you wish to set.
     * @returns {Promise<Object>} Parsed response data.
     */
    SetAVTransportURI(options: {
        InstanceID: number;
        CurrentURI: string;
        CurrentURIMetaData: string;
    }): Promise<any>;
    /**
     * Add an URI to the queue
     * @param {object} options The the required properties
     * @param {number} options.InstanceID The instance you want to control is always `0`
     * @param {string} options.EnqueuedURI The URI of the track you want to add
     * @param {string} options.EnqueuedURIMetaData The Metadata of the track you wish to add, see `Helpers.GenerateMetadata`
     * @param {number} options.DesiredFirstTrackNumberEnqueued The position in the queue
     * @param {number} options.EnqueueAsNext To Queue this item as the next item set to `1`
     * @returns {Promise<Object>} Parsed response data.
     */
    AddURIToQueue(options: {
        InstanceID: number;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: number;
    }): Promise<any>;
    AddURIToSavedQueue(options: any): Promise<any>;
    AddMultipleURIsToQueue(options: any): Promise<any>;
    /**
     * Reorder tracks in queue
     * @param {object} options All the required options
     * @param {number} options.InstanceID The instance you want to edit is always `0`
     * @param {number} options.UpdateID The update id, not a clue what this means. Just specify `0`
     * @param {number} options.StartingIndex The index of the first song you want to move.
     * @param {number} options.NumberOfTracks How many tracks do you want to move?
     * @param {number} options.InsertBefore Where should these tracks be inserted?
     * @returns {Promise<Object>} Parsed response data.
     */
    ReorderTracksInQueue(options: {
        InstanceID: number;
        UpdateID: number;
        StartingIndex: number;
        NumberOfTracks: number;
        InsertBefore: number;
    }): Promise<any>;
    ReorderTracksInSavedQueue(options: any): Promise<any>;
    /**
     * Remove a single track from the queue
     * @param {object} options Object with required options
     * @param {number} options.InstanceID The instance you want to control is always `0`
     * @param {string} options.ObjectID The object to remove
     * @param {string} options.UpdateID The update id, not a clue what this means. Just specify `0`
     * @returns {Promise<Object>} Parsed response data.
     */
    RemoveTrackFromQueue(options: {
        InstanceID: number;
        ObjectID: string;
        UpdateID: string;
    }): Promise<any>;
    /**
     * Remove a range of tracks from the queue
     * @param {object} options Object with required options
     * @param {number} options.InstanceID The instance you want to control is always `0`
     * @param {number} options.UpdateID The update id, not a clue what this means. Just specify `0`
     * @param {number} options.StartingIndex Index of the first song to remove
     * @param {number} options.NumberOfTracks How many tracks to remove
     * @returns {Promise<Object>} Parsed response data.
     */
    RemoveTrackRangeFromQueue(options: {
        InstanceID: number;
        UpdateID: number;
        StartingIndex: number;
        NumberOfTracks: number;
    }): Promise<any>;
    RemoveAllTracksFromQueue(): Promise<any>;
    SaveQueue(options: any): Promise<any>;
    CreateSavedQueue(title: any): Promise<any>;
    BackupQueue(options: any): Promise<any>;
    GetMediaInfo(): Promise<any>;
    GetTransportInfo(): Promise<any>;
    GetPositionInfo(): Promise<any>;
    GetDeviceCapabilities(): Promise<any>;
    GetTransportSettings(): Promise<any>;
    GetCrossfadeMode(): Promise<any>;
    Stop(): Promise<any>;
    Play(): Promise<any>;
    Pause(): Promise<any>;
    /**
     * Skip to other track or time
     * @param {object} options Object with required options
     * @param {number} options.InstanceID The instance you want to control is always `0`
     * @param {'TRACK_NR' | 'REL_TIME' | 'TIME_DELTA'} options.Unit One of these `TRACK_NR`, `REL_TIME`, `TIME_DELTA`
     * @param {string | number} options.Target Skip to what track number, relative time as hh:mm:ss, or track number
     */
    Seek(options: {
        InstanceID: number;
        Unit: 'TRACK_NR' | 'REL_TIME' | 'TIME_DELTA';
        Target: string | number;
    }): Promise<any>;
    Next(): Promise<any>;
    NextProgrammedRadioTracks(): Promise<any>;
    Previous(): Promise<any>;
    NextSection(options: any): Promise<any>;
    PreviousSection(options: any): Promise<any>;
    /**
     * Set the new playmode
     * @param {string} playmode One of the following `NORMAL` `REPEAT_ALL` `SHUFFLE` `SHUFFLE_NOREPEAT`
     * @returns {Promise<Object>} Parsed response data.
     */
    SetPlayMode(playmode: string): Promise<any>;
    SetCrossfadeMode(options: any): Promise<any>;
    NotifyDeletedURI(options: any): Promise<any>;
    GetCurrentTransportActions(): Promise<any>;
    BecomeCoordinatorOfStandaloneGroup(): Promise<any>;
    DelegateGroupCoordinationTo(options: any): Promise<any>;
    BecomeGroupCoordinator(options: any): Promise<any>;
    BecomeGroupCoordinatorAndSource(options: any): Promise<any>;
    /**
     * Configure a sleeptimer.
     * @param {string} duration the duration as 'ISO8601Time', needs sample!
     * @returns {Promise<Object>} Parsed response data.
     */
    ConfigureSleepTimer(duration: string): Promise<any>;
    GetRemainingSleepTimerDuration(): Promise<any>;
    RunAlarm(options: any): Promise<any>;
    StartAutoplay(options: any): Promise<any>;
    GetRunningAlarmProperties(options: any): Promise<any>;
    /**
     * Snooze the current running alarm for a number of minutes.
     * @param {string} duration The duration, as 'ISO8601Time', needs sample!
     * @returns {Promise<Object>} Parsed response data.
     */
    SnoozeAlarm(duration: string): Promise<any>;
    /**
     * Get information about the current track, parsed version of `GetPositionInfo()`
     * @returns {Promise<Object>} The current playing track
     */
    CurrentTrack(): Promise<any>;
}
import Service = require("./Service");
