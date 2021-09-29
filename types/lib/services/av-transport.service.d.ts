export = AVTransportService;
/**
 * Sonos AVTransportService
 *
 * Service that controls stuff related to transport (play/pause/next/special urls)
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class AVTransportService
 * @extends {Service}
 */
declare class AVTransportService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * AddMultipleURIsToQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.UpdateID
     * @param {number} options.NumberOfURIs
     * @param {string} options.EnqueuedURIs
     * @param {string} options.EnqueuedURIsMetaData
     * @param {string} options.ContainerURI
     * @param {string} options.ContainerMetaData
     * @param {number} options.DesiredFirstTrackNumberEnqueued
     * @param {boolean} options.EnqueueAsNext
     * @returns {Promise<Object>} response object, with these properties `FirstTrackNumberEnqueued`, `NumTracksAdded`, `NewQueueLength`, `NewUpdateID`
     */
    AddMultipleURIsToQueue(options?: {
        InstanceID: number;
        UpdateID: number;
        NumberOfURIs: number;
        EnqueuedURIs: string;
        EnqueuedURIsMetaData: string;
        ContainerURI: string;
        ContainerMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: boolean;
    }): Promise<any>;
    /**
     * AddURIToQueue - Adds songs to the SONOS queue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.EnqueuedURI
     * @param {string} options.EnqueuedURIMetaData
     * @param {number} options.DesiredFirstTrackNumberEnqueued - use `0` to add at the end or `1` to insert at the beginning
     * @param {boolean} options.EnqueueAsNext
     * @remarks In NORMAL play mode the songs are added prior to the specified `DesiredFirstTrackNumberEnqueued`.
     * @returns {Promise<Object>} response object, with these properties `FirstTrackNumberEnqueued`, `NumTracksAdded`, `NewQueueLength`
     */
    AddURIToQueue(options?: {
        InstanceID: number;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
        DesiredFirstTrackNumberEnqueued: number;
        EnqueueAsNext: boolean;
    }): Promise<any>;
    /**
     * AddURIToSavedQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.ObjectID
     * @param {number} options.UpdateID
     * @param {string} options.EnqueuedURI
     * @param {string} options.EnqueuedURIMetaData
     * @param {number} options.AddAtIndex
     * @returns {Promise<Object>} response object, with these properties `NumTracksAdded`, `NewQueueLength`, `NewUpdateID`
     */
    AddURIToSavedQueue(options?: {
        InstanceID: number;
        ObjectID: string;
        UpdateID: number;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
        AddAtIndex: number;
    }): Promise<any>;
    /**
     * BackupQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Boolean>} request succeeded
     */
    BackupQueue(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * BecomeCoordinatorOfStandaloneGroup - Leave the current group and revert to a single player.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Object>} response object, with these properties `DelegatedGroupCoordinatorID`, `NewGroupID`
     */
    BecomeCoordinatorOfStandaloneGroup(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * BecomeGroupCoordinator
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.CurrentCoordinator
     * @param {string} options.CurrentGroupID
     * @param {string} options.OtherMembers
     * @param {string} options.TransportSettings
     * @param {string} options.CurrentURI
     * @param {string} options.CurrentURIMetaData
     * @param {string} options.SleepTimerState
     * @param {string} options.AlarmState
     * @param {string} options.StreamRestartState
     * @param {string} options.CurrentQueueTrackList
     * @param {string} options.CurrentVLIState
     * @returns {Promise<Boolean>} request succeeded
     */
    BecomeGroupCoordinator(options?: {
        InstanceID: number;
        CurrentCoordinator: string;
        CurrentGroupID: string;
        OtherMembers: string;
        TransportSettings: string;
        CurrentURI: string;
        CurrentURIMetaData: string;
        SleepTimerState: string;
        AlarmState: string;
        StreamRestartState: string;
        CurrentQueueTrackList: string;
        CurrentVLIState: string;
    }): Promise<boolean>;
    /**
     * BecomeGroupCoordinatorAndSource
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.CurrentCoordinator
     * @param {string} options.CurrentGroupID
     * @param {string} options.OtherMembers
     * @param {string} options.CurrentURI
     * @param {string} options.CurrentURIMetaData
     * @param {string} options.SleepTimerState
     * @param {string} options.AlarmState
     * @param {string} options.StreamRestartState
     * @param {string} options.CurrentAVTTrackList
     * @param {string} options.CurrentQueueTrackList
     * @param {string} options.CurrentSourceState
     * @param {boolean} options.ResumePlayback
     * @returns {Promise<Boolean>} request succeeded
     */
    BecomeGroupCoordinatorAndSource(options?: {
        InstanceID: number;
        CurrentCoordinator: string;
        CurrentGroupID: string;
        OtherMembers: string;
        CurrentURI: string;
        CurrentURIMetaData: string;
        SleepTimerState: string;
        AlarmState: string;
        StreamRestartState: string;
        CurrentAVTTrackList: string;
        CurrentQueueTrackList: string;
        CurrentSourceState: string;
        ResumePlayback: boolean;
    }): Promise<boolean>;
    /**
     * ChangeCoordinator
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.CurrentCoordinator
     * @param {string} options.NewCoordinator
     * @param {string} options.NewTransportSettings
     * @param {string} options.CurrentAVTransportURI
     * @returns {Promise<Boolean>} request succeeded
     */
    ChangeCoordinator(options?: {
        InstanceID: number;
        CurrentCoordinator: string;
        NewCoordinator: string;
        NewTransportSettings: string;
        CurrentAVTransportURI: string;
    }): Promise<boolean>;
    /**
     * ChangeTransportSettings
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.NewTransportSettings
     * @param {string} options.CurrentAVTransportURI
     * @returns {Promise<Boolean>} request succeeded
     */
    ChangeTransportSettings(options?: {
        InstanceID: number;
        NewTransportSettings: string;
        CurrentAVTransportURI: string;
    }): Promise<boolean>;
    /**
     * ConfigureSleepTimer - Stop playing after set sleep timer or cancel
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.NewSleepTimerDuration - Time to stop after, as `hh:mm:ss` or empty string to cancel
     * @remarks Send to non-coordinator returns error code 800
     * @returns {Promise<Boolean>} request succeeded
     */
    ConfigureSleepTimer(options?: {
        InstanceID: number;
        NewSleepTimerDuration: string;
    }): Promise<boolean>;
    /**
     * CreateSavedQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.Title
     * @param {string} options.EnqueuedURI
     * @param {string} options.EnqueuedURIMetaData
     * @returns {Promise<Object>} response object, with these properties `NumTracksAdded`, `NewQueueLength`, `AssignedObjectID`, `NewUpdateID`
     */
    CreateSavedQueue(options?: {
        InstanceID: number;
        Title: string;
        EnqueuedURI: string;
        EnqueuedURIMetaData: string;
    }): Promise<any>;
    /**
     * DelegateGroupCoordinationTo - Delegates the coordinator role to another player in the same group
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.NewCoordinator - uuid of the new coordinator - must be in same group
     * @param {boolean} options.RejoinGroup - Should former coordinator rejoin the group?
     * @remarks Send to non-coordinator has no results - should be avoided.
     * @returns {Promise<Boolean>} request succeeded
     */
    DelegateGroupCoordinationTo(options?: {
        InstanceID: number;
        NewCoordinator: string;
        RejoinGroup: boolean;
    }): Promise<boolean>;
    /**
     * EndDirectControlSession
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Boolean>} request succeeded
     */
    EndDirectControlSession(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * GetCrossfadeMode - Get crossfade mode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Send to non-coordinator may return wrong value as only the coordinator value in a group
     * @returns {Promise<Object>} response object, with these properties `CrossfadeMode`
     */
    GetCrossfadeMode(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetCurrentTransportActions - Get current transport actions such as Set, Stop, Pause, Play, X_DLNA_SeekTime, Next, X_DLNA_SeekTrackNr
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Send to non-coordinator returns only `Start` and `Stop` since it cannot control the stream.
     * @returns {Promise<Object>} response object, with these properties `Actions`
     */
    GetCurrentTransportActions(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetDeviceCapabilities
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Object>} response object, with these properties `PlayMedia`, `RecMedia`, `RecQualityModes`
     */
    GetDeviceCapabilities(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetMediaInfo - Get information about the current playing media (queue)
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Object>} response object, with these properties `NrTracks`, `MediaDuration`, `CurrentURI`, `CurrentURIMetaData`, `NextURI`, `NextURIMetaData`, `PlayMedium`, `RecordMedium`, `WriteStatus`
     */
    GetMediaInfo(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetPositionInfo - Get information about current position (position in queue and time in current song)
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Object>} response object, with these properties `Track`, `TrackDuration`, `TrackMetaData`, `TrackURI`, `RelTime`, `AbsTime`, `RelCount`, `AbsCount`
     */
    GetPositionInfo(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetRemainingSleepTimerDuration - Get time left on sleeptimer.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Send to non-coordinator returns error code 800
     * @returns {Promise<Object>} response object, with these properties `RemainingSleepTimerDuration`, `CurrentSleepTimerGeneration`
     */
    GetRemainingSleepTimerDuration(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetRunningAlarmProperties
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Object>} response object, with these properties `AlarmID`, `GroupID`, `LoggedStartTime`
     */
    GetRunningAlarmProperties(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetTransportInfo - Get current transport status, speed and state such as PLAYING, STOPPED, PLAYING, PAUSED_PLAYBACK, TRANSITIONING, NO_MEDIA_PRESENT
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Send to non-coordinator always returns PLAYING
     * @returns {Promise<Object>} response object, with these properties `CurrentTransportState`, `CurrentTransportStatus`, `CurrentSpeed`
     */
    GetTransportInfo(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetTransportSettings - Get transport settings
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Send to non-coordinator returns the settings of it's queue
     * @returns {Promise<Object>} response object, with these properties `PlayMode`, `RecQualityMode`
     */
    GetTransportSettings(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * Next - Go to next song
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Possibly not supported at the moment see GetCurrentTransportActions
     * @returns {Promise<Boolean>} request succeeded
     */
    Next(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * NotifyDeletedURI
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.DeletedURI
     * @returns {Promise<Boolean>} request succeeded
     */
    NotifyDeletedURI(options?: {
        InstanceID: number;
        DeletedURI: string;
    }): Promise<boolean>;
    /**
     * Pause - Pause playback
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Boolean>} request succeeded
     */
    Pause(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * Play - Start playing the set TransportURI
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.Speed - Play speed usually 1, can be a fraction of 1 [ '1' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    Play(options?: {
        InstanceID: number;
        Speed: string;
    }): Promise<boolean>;
    /**
     * Previous - Go to previous song
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Possibly not supported at the moment see GetCurrentTransportActions
     * @returns {Promise<Boolean>} request succeeded
     */
    Previous(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * RemoveAllTracksFromQueue - Flushes the SONOS queue.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks If queue is already empty it throw error 804. Send to non-coordinator returns error code 800.
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveAllTracksFromQueue(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * RemoveTrackFromQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.ObjectID
     * @param {number} options.UpdateID
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveTrackFromQueue(options?: {
        InstanceID: number;
        ObjectID: string;
        UpdateID: number;
    }): Promise<boolean>;
    /**
     * RemoveTrackRangeFromQueue - Removes the specified range of songs from the SONOS queue.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.UpdateID - Leave blank
     * @param {number} options.StartingIndex - between 1 and queue-length
     * @param {number} options.NumberOfTracks
     * @returns {Promise<Object>} response object, with these properties `NewUpdateID`
     */
    RemoveTrackRangeFromQueue(options?: {
        InstanceID: number;
        UpdateID: number;
        StartingIndex: number;
        NumberOfTracks: number;
    }): Promise<any>;
    /**
     * ReorderTracksInQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.StartingIndex
     * @param {number} options.NumberOfTracks
     * @param {number} options.InsertBefore
     * @param {number} options.UpdateID
     * @returns {Promise<Boolean>} request succeeded
     */
    ReorderTracksInQueue(options?: {
        InstanceID: number;
        StartingIndex: number;
        NumberOfTracks: number;
        InsertBefore: number;
        UpdateID: number;
    }): Promise<boolean>;
    /**
     * ReorderTracksInSavedQueue
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.ObjectID
     * @param {number} options.UpdateID
     * @param {string} options.TrackList
     * @param {string} options.NewPositionList
     * @returns {Promise<Object>} response object, with these properties `QueueLengthChange`, `NewQueueLength`, `NewUpdateID`
     */
    ReorderTracksInSavedQueue(options?: {
        InstanceID: number;
        ObjectID: string;
        UpdateID: number;
        TrackList: string;
        NewPositionList: string;
    }): Promise<any>;
    /**
     * RunAlarm
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.AlarmID
     * @param {string} options.LoggedStartTime
     * @param {string} options.Duration
     * @param {string} options.ProgramURI
     * @param {string} options.ProgramMetaData
     * @param {string} options.PlayMode [ 'NORMAL' / 'REPEAT_ALL' / 'REPEAT_ONE' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' / 'SHUFFLE_REPEAT_ONE' ]
     * @param {number} options.Volume
     * @param {boolean} options.IncludeLinkedZones
     * @returns {Promise<Boolean>} request succeeded
     */
    RunAlarm(options?: {
        InstanceID: number;
        AlarmID: number;
        LoggedStartTime: string;
        Duration: string;
        ProgramURI: string;
        ProgramMetaData: string;
        PlayMode: string;
        Volume: number;
        IncludeLinkedZones: boolean;
    }): Promise<boolean>;
    /**
     * SaveQueue - Saves the current SONOS queue as a SONOS playlist and outputs objectID
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.Title - SONOS playlist title
     * @param {string} options.ObjectID - Leave blank
     * @remarks Send to non-coordinator returns error code 800
     * @returns {Promise<Object>} response object, with these properties `AssignedObjectID`
     */
    SaveQueue(options?: {
        InstanceID: number;
        Title: string;
        ObjectID: string;
    }): Promise<any>;
    /**
     * Seek - Seek track in queue, time delta or absolute time in song
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.Unit - What to seek [ 'TRACK_NR' / 'REL_TIME' / 'TIME_DELTA' ]
     * @param {string} options.Target - Position of track in queue (start at 1) or `hh:mm:ss` for `REL_TIME` or `+/-hh:mm:ss` for `TIME_DELTA`
     * @remarks Returns error code 701 in case that content does not support Seek or send to non-coordinator
     * @returns {Promise<Boolean>} request succeeded
     */
    Seek(options?: {
        InstanceID: number;
        Unit: string;
        Target: string;
    }): Promise<boolean>;
    /**
     * SetAVTransportURI - Set the transport URI to a song, a stream, the queue, another player-rincon and a lot more
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.CurrentURI - The new TransportURI - its a special SONOS format
     * @param {string} options.CurrentURIMetaData - Track Metadata, see MetadataHelper.GuessTrack to guess based on track uri
     * @remarks If set to another player RINCON, the player is grouped with that one.
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAVTransportURI(options?: {
        InstanceID: number;
        CurrentURI: string;
        CurrentURIMetaData: string;
    }): Promise<boolean>;
    /**
     * SetCrossfadeMode - Set crossfade mode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {boolean} options.CrossfadeMode
     * @remarks Send to non-coordinator returns error code 800. Same for content, which does not support crossfade mode.
     * @returns {Promise<Boolean>} request succeeded
     */
    SetCrossfadeMode(options?: {
        InstanceID: number;
        CrossfadeMode: boolean;
    }): Promise<boolean>;
    /**
     * SetNextAVTransportURI
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.NextURI
     * @param {string} options.NextURIMetaData
     * @returns {Promise<Boolean>} request succeeded
     */
    SetNextAVTransportURI(options?: {
        InstanceID: number;
        NextURI: string;
        NextURIMetaData: string;
    }): Promise<boolean>;
    /**
     * SetPlayMode - Set the PlayMode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.NewPlayMode - New playmode [ 'NORMAL' / 'REPEAT_ALL' / 'REPEAT_ONE' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' / 'SHUFFLE_REPEAT_ONE' ]
     * @remarks Send to non-coordinator returns error code 712. If SONOS queue is not activated returns error code 712.
     * @returns {Promise<Boolean>} request succeeded
     */
    SetPlayMode(options?: {
        InstanceID: number;
        NewPlayMode: string;
    }): Promise<boolean>;
    /**
     * SnoozeAlarm - Snooze the current alarm for some time.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.Duration - Snooze time as `hh:mm:ss`, 10 minutes = 00:10:00
     * @returns {Promise<Boolean>} request succeeded
     */
    SnoozeAlarm(options?: {
        InstanceID: number;
        Duration: string;
    }): Promise<boolean>;
    /**
     * StartAutoplay
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {string} options.ProgramURI
     * @param {string} options.ProgramMetaData
     * @param {number} options.Volume
     * @param {boolean} options.IncludeLinkedZones
     * @param {boolean} options.ResetVolumeAfter
     * @returns {Promise<Boolean>} request succeeded
     */
    StartAutoplay(options?: {
        InstanceID: number;
        ProgramURI: string;
        ProgramMetaData: string;
        Volume: number;
        IncludeLinkedZones: boolean;
        ResetVolumeAfter: boolean;
    }): Promise<boolean>;
    /**
     * Stop - Stop playback
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @returns {Promise<Boolean>} request succeeded
     */
    Stop(options?: {
        InstanceID: number;
    }): Promise<boolean>;
}
import Service = require("./Service");
