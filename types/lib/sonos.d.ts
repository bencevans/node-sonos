/**
 * Create an instance of Sonos
 * @class Sonos
 * @param {String} host IP/DNS
 * @param {Number} port port, defaults to `1400`
 * @returns {Sonos}
 */
export class Sonos extends EventEmitter {
    constructor(host: any, port: any, options: any);
    host: any;
    port: any;
    options: any;
    _isSubscribed: any;
    _state: any;
    _mute: any;
    _volume: any;
    /**
     * Get Music Library Information
     * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns {Promise<Object>}  {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getMusicLibrary(searchType: string, options: any): Promise<any>;
    /**
     * Get Music Library Information
     * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
     * @param  {String}   searchTerm  Optional - search term to search for
     * @param  {Object}   requestOptions     Optional - default {start: 0, total: 100}
     * @param  {String}   separator   Optional - default is colon. `:` or `/`
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    searchMusicLibrary(searchType: string, searchTerm: string, requestOptions?: any, separator?: string): Promise<any>;
    /**
     * Get Sonos Playlist
     * @param {String}    playlistId      Sonos id of the playlist
     * @param  {Object}   requestOptions  Optional - default {start: 0, total: 100}
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getPlaylist(playlistId: string, requestOptions?: any): Promise<any>;
    /**
     * Create a new sonos playlist
     * @param {String}  title   Name of the playlist
     * @returns {Promise<Object>} { NumTracksAdded: 0, NewQueueLength: 0, NewUpdateID: 0, AssignedObjectID: 'SQ:3' }
     */
    createPlaylist(title: string): Promise<any>;
    /**
     * Delete sonos playlist
     * @param {Number}  playlistId   Sonos id of the playlist
     * @returns {Promise<Boolean>} Playlist deleted
     */
    deletePlaylist(playlistId: number): Promise<boolean>;
    /**
     * Add uri to sonos playlist
     * @param {String}  playlistId   Sonos id of the playlist
     * @param {String}  uri   Uri to add to the playlist
     * @returns {Promise<Object>} { NumTracksAdded: 1, NewQueueLength: 2, NewUpdateID: 2 }
     */
    addToPlaylist(playlistId: string, uri: string): Promise<any>;
    /**
     * Remove track from playlist
     * @param {String}  playlistId   Sonos id of the playlist
     * @param {String}  index   Index of song to remove
     * @returns {Promise<Object>} { QueueLengthChange: -1, NewQueueLength: 2, NewUpdateID: 2 }
     */
    removeFromPlaylist(playlistId: string, index: string): Promise<any>;
    /**
     * Get Sonos Favorites
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getFavorites(): Promise<any>;
    /**
     * Get Current Track
     * @returns {Promise<Object>} All the info of the current track
     */
    currentTrack(): Promise<any>;
    /**
     * Get Current Volume
     * @returns {Promise<Number>} The current volume
     */
    getVolume(): Promise<number>;
    /**
     * Get Current Muted
     * @returns {Promise<Boolean>}
     */
    getMuted(): Promise<boolean>;
    /**
     * Resumes Queue or Plays Provided URI
     * @param  {String|Object}   options      Optional - URI to a Audio Stream or Object with play options
     * @returns {Promise<Boolean>} Started playing?
     */
    play(options: string | any): Promise<boolean>;
    /**
     * Plays a uri directly (the queue stays the same)
     * @param  {String|Object}   options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
     * @returns {Promise<Boolean>}
     */
    setAVTransportURI(options: string | any): Promise<boolean>;
    /**
     * Stop What's Playing
     * @returns {Promise<Boolean>}
     */
    stop(): Promise<boolean>;
    /**
    * Get all the groups, replaces some functionality of 'getTopology()'
    */
    getAllGroups(): Promise<any[]>;
    /**
     * Become Coordinator of Standalone Group
     * @returns {Promise<Boolean>}
     */
    becomeCoordinatorOfStandaloneGroup(): Promise<boolean>;
    /**
     * Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)
     * @returns {Promise<Boolean>}
     */
    leaveGroup(): Promise<boolean>;
    /**
     * Join an other device by name
     * @param  {String} otherDeviceName The name of de device you want to join, doesn't matter if that isn't the coordinator
     * @returns {Promise<Boolean>}
     */
    joinGroup(otherDeviceName: string): Promise<boolean>;
    /**
     * Pause Current Queue
     * @returns {Promise<Boolean>}
     */
    pause(): Promise<boolean>;
    /**
     * Seek in the current track
     * @param  {Number} seconds jump to x seconds.
     * @returns {Promise<Boolean>}
     */
    seek(seconds: number): Promise<boolean>;
    /**
     * Select specific track in queue
     * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
     * @returns {Promise<Boolean>}
     */
    selectTrack(trackNr: number): Promise<boolean>;
    /**
     * Play next in queue
     * @returns {Promise<Boolean>}
     */
    next(): Promise<boolean>;
    /**
     * Play previous in queue
     * @returns {Promise<Boolean>}
     */
    previous(): Promise<boolean>;
    /**
     * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
     * @returns {Promise<Boolean>} success
     */
    selectQueue(): Promise<boolean>;
    /**
     * Plays tunein based on radio station id
     * @param  {String}   stationId  tunein radio station id
     * @returns {Promise<Boolean>}
     */
    playTuneinRadio(stationId: string, stationTitle: any): Promise<boolean>;
    /**
     * Plays Spotify radio based on artist uri
     * @param  {String}   artistId  Spotify artist id
     * @returns {Promise<Boolean>}
     */
    playSpotifyRadio(artistId: string, artistName: any): Promise<boolean>;
    /**
     * Add a song to the queue.
     * @param  {String|Object}   options  Uri with audio stream of object with `uri` and `metadata`
     * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
     *                                    defaults to end of queue, 0 to explicitly set end of queue)
     * @returns {Promise<Object>} Some info about the last queued file.
     */
    queue(options: string | any, positionInQueue?: number): Promise<any>;
    /**
     * Remove a range of tracks from the queue.
     * @param {number} startIndex Where to start removing the tracks, 1 for first item!
     * @param {number} numberOfTracks How many tracks to remove.
     */
    removeTracksFromQueue(startIndex: number, numberOfTracks?: number): Promise<any>;
    /**
     * Flush queue
     * @returns {Promise<Object>}
     */
    flush(): Promise<any>;
    /**
     * Get the LED State
     * @returns {Promise<String>} state is a string, "On" or "Off"
     */
    getLEDState(): Promise<string>;
    /**
     * Set the LED State
     * @param  {String}   newState           "On"/"Off"
     * @returns {Promise<Boolean>}
     */
    setLEDState(newState: string): Promise<boolean>;
    /**
     * Get Zone Info
     * @returns {Promise<Object>}
     */
    getZoneInfo(): Promise<any>;
    /**
     * Get Zone Attributes
     * @returns {Promise<Object>}
     */
    getZoneAttrs(): Promise<any>;
    /**
     * Get Information provided by /xml/device_description.xml
     * @returns {Promise<Object>}
     */
    deviceDescription(): Promise<any>;
    /**
     * Set Name
     * @param  {String}   name
     * @returns {Promise<Object>}
     */
    setName(name: string): Promise<any>;
    /**
     * Get the CurrentZoneName
     * @returns {Promise<String>}
     */
    getName(): Promise<string>;
    /**
     * Get Play Mode
     * @returns {Promise<String>}
     */
    getPlayMode(): Promise<string>;
    /**
     * Set Play Mode
     * @param  {String} playmode
     * @returns {Promise<Object>}
     */
    setPlayMode(playmode: string): Promise<any>;
    /**
     * Set Volume
     * @param  {number}   volume 0..100
     * @param  {string}   channel What channel to change, `Master` is default.
     * @returns {Promise<Object>}
     */
    setVolume(volume: number, channel?: string): Promise<any>;
    /**
     * Adjust volume
     * @param  {number} volumeAdjustment The relative volume adjustment
     * @param  {string} channel The channel you want to set, `Master` is default.
     */
    adjustVolume(volumeAdjustment: number, channel?: string): Promise<any>;
    /**
     * Configure Sleep Timer
     * @param  {String} sleepTimerDuration
     * @returns {Promise<Object>}
     */
    configureSleepTimer(sleepTimerDuration: string): Promise<any>;
    /**
     * Set Muted
     * @param  {Boolean}  muted
     * @param  {string}   channel What channel to change, `Master` is default.
     * @returns {Promise<Object>}
     */
    setMuted(muted: boolean, channel?: string): Promise<any>;
    /**
     * Get device balance as number from -100 (full left) to +100 (full right), where 0 is left and right equal
     * @returns {Promise}
     */
    getBalance(): Promise<any>;
    /**
     * Set device balance
     * @param {Number} balance  from -100 (full left) to +100 (full right), where 0 is left and right equal
     * @returns {Promise}
     */
    setBalance(balance: number): Promise<any>;
    /**
     * Get Zones in contact with current Zone with Group Data
     * @deprecated Doesn't work if you upgraded your system to Sonos v9.1
     * @returns {Promise<Object>}
     */
    getTopology(): Promise<any>;
    /**
     * Get Current Playback State
     * @returns {Promise<String>} the current playback state
     */
    getCurrentState(): Promise<string>;
    /**
     * Toggle the current playback, like the button. Currently only works for state `playing` or `paused`
     * @returns {Promise<Boolean>}
     */
    togglePlayback(): Promise<boolean>;
    /**
     * Get Favorites Radio Stations
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getFavoritesRadioStations(options: any): Promise<any>;
    /**
     * Get Favorites Radio Shows
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getFavoritesRadioShows(options: any): Promise<any>;
    /**
     * Get Favorites Radio for a given radio type
     * @param  {String}   favoriteRadioType  Choice - stations, shows
     * @param  {Object}   requestOptions     Optional - default {start: 0, total: 100}
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getFavoritesRadio(favoriteRadioType: string, requestOptions?: any): Promise<any>;
    setSpotifyRegion(region: any): void;
    /**
     * Get the current queue
     * @returns {Promise<Object>} {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    getQueue(): Promise<any>;
    /**
     * Play uri and restore last state
     * @param  {Object}  options URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`
     * @param  {String}         options.uri The URI of the stream
     * @param  {String}         options.metadata The metadata of the stream see `Helpers.GenerateMetadata`
     * @param  {Boolean}        options.onlyWhenPlaying Only play this notification on players currently 'playing'
     * @param  {Number}         options.volume The volume used for the notification.
     * @returns {Promise<Boolean>}       Did the notification play? Only returns when finished reverting to old play settings.
     */
    playNotification(options: {
        uri: string;
        metadata: string;
        onlyWhenPlaying: boolean;
        volume: number;
    }): Promise<boolean>;
    /**
     * Reorder tracks in queue.
     * @param {number} startingIndex Index of the first track to be moved
     * @param {number} numberOfTracks How many tracks do we want to move
     * @param {number} insertBefore Index of place where the tracks should be moved to
     * @param {number} updateId Not sure what this means, just leave it at `0`
     * @returns {Promise<Boolean>}
     */
    reorderTracksInQueue(startingIndex: number, numberOfTracks: number, insertBefore: number, updateId?: number): Promise<boolean>;
    /**
     * Get SpotifyConnect info, will error when no premium account is present
     * @returns {Promise<Object>}
     */
    getSpotifyConnectInfo(): Promise<any>;
    /**
     * Get device spicific ZPInfo, will return empty object if failed for some reason
     * This is useful for extracting the HouseholdControlID, Mac Address, serial number etc
     * @returns {Promise<Object>}
     */
    getZPInfo(): Promise<any>;
    alarmClockService(): import("./services/AlarmClock");
    avTransportService(): import("./services/AVTransport");
    contentDirectoryService(): import("./services/ContentDirectory");
    devicePropertiesService(): import("./services/DeviceProperties");
    groupRenderingControlService(): import("./services/GroupRenderingControl");
    renderingControlService(): import("./services/RenderingControl");
    zoneGroupTopologyService(): import("./services/ZoneGroupTopology");
    musicServices(): import("./services/MusicServices");
    /**
     * Get all services available to sonos.
     */
    get generatedServices(): GeneratedServices.AllServices;
}
import deviceDiscovery = require("./deviceDiscovery");
import asyncDeviceDiscovery = require("./asyncDeviceDiscovery");
import Helpers = require("./helpers");
export namespace Services {
    const AlarmClock_1: typeof import("./services/AlarmClock");
    export { AlarmClock_1 as AlarmClock };
    export const AudioIn: typeof import("./services/AudioIn");
    const AVTransport_1: typeof import("./services/AVTransport");
    export { AVTransport_1 as AVTransport };
    const ContentDirectory_1: typeof import("./services/ContentDirectory");
    export { ContentDirectory_1 as ContentDirectory };
    const DeviceProperties_1: typeof import("./services/DeviceProperties");
    export { DeviceProperties_1 as DeviceProperties };
    export const GroupManagement: typeof import("./services/GroupManagement");
    const GroupRenderingControl_1: typeof import("./services/GroupRenderingControl");
    export { GroupRenderingControl_1 as GroupRenderingControl };
    const MusicServices_1: typeof import("./services/MusicServices");
    export { MusicServices_1 as MusicServices };
    const RenderingControl_1: typeof import("./services/RenderingControl");
    export { RenderingControl_1 as RenderingControl };
    export const Service: typeof import("./services/Service");
    export const SystemProperties: typeof import("./services/SystemProperties");
    const ZoneGroupTopology_1: typeof import("./services/ZoneGroupTopology");
    export { ZoneGroupTopology_1 as ZoneGroupTopology };
}
import GeneratedServices = require("./services/all-services");
import Listener = require("./events/adv-listener");
export namespace SpotifyRegion {
    const EU: string;
    const US: string;
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
export { deviceDiscovery as DeviceDiscovery, deviceDiscovery as Search, asyncDeviceDiscovery as AsyncDeviceDiscovery, Helpers, GeneratedServices, Listener };
