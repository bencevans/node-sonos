export = DevicePropertiesService;
/**
 * Sonos DevicePropertiesService
 *
 * Modify device properties, like LED status and stereo pairs
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class DevicePropertiesService
 * @extends {Service}
 */
declare class DevicePropertiesService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * AddBondedZones
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.ChannelMapSet
     * @returns {Promise<Boolean>} request succeeded
     */
    AddBondedZones(options?: {
        ChannelMapSet: string;
    }): Promise<boolean>;
    /**
     * AddHTSatellite
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.HTSatChanMapSet
     * @returns {Promise<Boolean>} request succeeded
     */
    AddHTSatellite(options?: {
        HTSatChanMapSet: string;
    }): Promise<boolean>;
    /**
     * CreateStereoPair - Create a stereo pair (left, right speakers), right one becomes hidden
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
     * @remarks No all speakers support StereoPairs
     * @returns {Promise<Boolean>} request succeeded
     */
    CreateStereoPair(options?: {
        ChannelMapSet: string;
    }): Promise<boolean>;
    /**
     * EnterConfigMode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Mode
     * @param {string} options.Options
     * @returns {Promise<Object>} response object, with these properties `State`
     */
    EnterConfigMode(options?: {
        Mode: string;
        Options: string;
    }): Promise<any>;
    /**
     * ExitConfigMode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Options
     * @returns {Promise<Boolean>} request succeeded
     */
    ExitConfigMode(options?: {
        Options: string;
    }): Promise<boolean>;
    /**
     * GetAutoplayLinkedZones
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<Object>} response object, with these properties `IncludeLinkedZones`
     */
    GetAutoplayLinkedZones(options?: {
        Source: string;
    }): Promise<any>;
    /**
     * GetAutoplayRoomUUID
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<Object>} response object, with these properties `RoomUUID`
     */
    GetAutoplayRoomUUID(options?: {
        Source: string;
    }): Promise<any>;
    /**
     * GetAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<Object>} response object, with these properties `CurrentVolume`
     */
    GetAutoplayVolume(options?: {
        Source: string;
    }): Promise<any>;
    /**
     * GetButtonLockState - Get the current button lock state
     * @returns {Promise<Object>} response object, with these properties `CurrentButtonLockState`
     */
    GetButtonLockState(): Promise<any>;
    /**
     * GetButtonState
     * @returns {Promise<Object>} response object, with these properties `State`
     */
    GetButtonState(): Promise<any>;
    /**
     * GetHouseholdID
     * @returns {Promise<Object>} response object, with these properties `CurrentHouseholdID`
     */
    GetHouseholdID(): Promise<any>;
    /**
     * GetLEDState - Get the current LED state
     * @returns {Promise<Object>} response object, with these properties `CurrentLEDState`
     */
    GetLEDState(): Promise<any>;
    /**
     * GetUseAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<Object>} response object, with these properties `UseVolume`
     */
    GetUseAutoplayVolume(options?: {
        Source: string;
    }): Promise<any>;
    /**
     * GetZoneAttributes
     * @returns {Promise<Object>} response object, with these properties `CurrentZoneName`, `CurrentIcon`, `CurrentConfiguration`
     */
    GetZoneAttributes(): Promise<any>;
    /**
     * GetZoneInfo - Get information about this specific speaker
     * @returns {Promise<Object>} response object, with these properties `SerialNumber`, `SoftwareVersion`, `DisplaySoftwareVersion`, `HardwareVersion`, `IPAddress`, `MACAddress`, `CopyrightInfo`, `ExtraInfo`, `HTAudioIn`, `Flags`
     */
    GetZoneInfo(): Promise<any>;
    /**
     * RemoveBondedZones
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.ChannelMapSet
     * @param {boolean} options.KeepGrouped
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveBondedZones(options?: {
        ChannelMapSet: string;
        KeepGrouped: boolean;
    }): Promise<boolean>;
    /**
     * RemoveHTSatellite
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.SatRoomUUID
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveHTSatellite(options?: {
        SatRoomUUID: string;
    }): Promise<boolean>;
    /**
     * RoomDetectionStartChirping
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Channel
     * @param {number} options.DurationMilliseconds
     * @returns {Promise<Object>} response object, with these properties `PlayId`, `ChirpIfPlayingSwappableAudio`
     */
    RoomDetectionStartChirping(options?: {
        Channel: number;
        DurationMilliseconds: number;
    }): Promise<any>;
    /**
     * RoomDetectionStopChirping
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.PlayId
     * @returns {Promise<Boolean>} request succeeded
     */
    RoomDetectionStopChirping(options?: {
        PlayId: number;
    }): Promise<boolean>;
    /**
     * SeparateStereoPair - Separate a stereo pair
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.ChannelMapSet - example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF`
     * @remarks No all speakers support StereoPairs
     * @returns {Promise<Boolean>} request succeeded
     */
    SeparateStereoPair(options?: {
        ChannelMapSet: string;
    }): Promise<boolean>;
    /**
     * SetAutoplayLinkedZones
     *
     * @param {Object} [options] - An object with the following properties
     * @param {boolean} options.IncludeLinkedZones
     * @param {string} options.Source
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAutoplayLinkedZones(options?: {
        IncludeLinkedZones: boolean;
        Source: string;
    }): Promise<boolean>;
    /**
     * SetAutoplayRoomUUID
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.RoomUUID
     * @param {string} options.Source
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAutoplayRoomUUID(options?: {
        RoomUUID: string;
        Source: string;
    }): Promise<boolean>;
    /**
     * SetAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Volume
     * @param {string} options.Source
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAutoplayVolume(options?: {
        Volume: number;
        Source: string;
    }): Promise<boolean>;
    /**
     * SetButtonLockState - Set the button lock state
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredButtonLockState [ 'On' / 'Off' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    SetButtonLockState(options?: {
        DesiredButtonLockState: string;
    }): Promise<boolean>;
    /**
     * SetLEDState - Set the LED state
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredLEDState [ 'On' / 'Off' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    SetLEDState(options?: {
        DesiredLEDState: string;
    }): Promise<boolean>;
    /**
     * SetUseAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {boolean} options.UseVolume
     * @param {string} options.Source
     * @returns {Promise<Boolean>} request succeeded
     */
    SetUseAutoplayVolume(options?: {
        UseVolume: boolean;
        Source: string;
    }): Promise<boolean>;
    /**
     * SetZoneAttributes
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredZoneName
     * @param {string} options.DesiredIcon
     * @param {string} options.DesiredConfiguration
     * @returns {Promise<Boolean>} request succeeded
     */
    SetZoneAttributes(options?: {
        DesiredZoneName: string;
        DesiredIcon: string;
        DesiredConfiguration: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
