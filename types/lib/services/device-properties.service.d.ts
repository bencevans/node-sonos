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
     * @returns {Promise<{ State: string}>} response object.
     */
    EnterConfigMode(options?: {
        Mode: string;
        Options: string;
    }): Promise<{
        State: string;
    }>;
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
     * @returns {Promise<{ IncludeLinkedZones: boolean}>} response object.
     */
    GetAutoplayLinkedZones(options?: {
        Source: string;
    }): Promise<{
        IncludeLinkedZones: boolean;
    }>;
    /**
     * GetAutoplayRoomUUID
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<{ RoomUUID: string}>} response object.
     */
    GetAutoplayRoomUUID(options?: {
        Source: string;
    }): Promise<{
        RoomUUID: string;
    }>;
    /**
     * GetAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<{ CurrentVolume: number}>} response object.
     */
    GetAutoplayVolume(options?: {
        Source: string;
    }): Promise<{
        CurrentVolume: number;
    }>;
    /**
     * GetButtonLockState - Get the current button lock state
     * @returns {Promise<{ CurrentButtonLockState: string}>} response object.
     */
    GetButtonLockState(): Promise<{
        CurrentButtonLockState: string;
    }>;
    /**
     * GetButtonState
     * @returns {Promise<{ State: string}>} response object.
     */
    GetButtonState(): Promise<{
        State: string;
    }>;
    /**
     * GetHouseholdID
     * @returns {Promise<{ CurrentHouseholdID: string}>} response object.
     */
    GetHouseholdID(): Promise<{
        CurrentHouseholdID: string;
    }>;
    /**
     * GetLEDState - Get the current LED state
     * @returns {Promise<{ CurrentLEDState: string}>} response object.
     */
    GetLEDState(): Promise<{
        CurrentLEDState: string;
    }>;
    /**
     * GetUseAutoplayVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Source
     * @returns {Promise<{ UseVolume: boolean}>} response object.
     */
    GetUseAutoplayVolume(options?: {
        Source: string;
    }): Promise<{
        UseVolume: boolean;
    }>;
    /**
     * GetZoneAttributes
     * @returns {Promise<{ CurrentZoneName: string, CurrentIcon: string, CurrentConfiguration: string}>} response object.
     */
    GetZoneAttributes(): Promise<{
        CurrentZoneName: string;
        CurrentIcon: string;
        CurrentConfiguration: string;
    }>;
    /**
     * GetZoneInfo - Get information about this specific speaker
     * @returns {Promise<{ SerialNumber: string, SoftwareVersion: string, DisplaySoftwareVersion: string, HardwareVersion: string, IPAddress: string, MACAddress: string, CopyrightInfo: string, ExtraInfo: string, HTAudioIn: number, Flags: number}>} response object.
     */
    GetZoneInfo(): Promise<{
        SerialNumber: string;
        SoftwareVersion: string;
        DisplaySoftwareVersion: string;
        HardwareVersion: string;
        IPAddress: string;
        MACAddress: string;
        CopyrightInfo: string;
        ExtraInfo: string;
        HTAudioIn: number;
        Flags: number;
    }>;
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
     * @returns {Promise<{ PlayId: number, ChirpIfPlayingSwappableAudio: boolean}>} response object.
     */
    RoomDetectionStartChirping(options?: {
        Channel: number;
        DurationMilliseconds: number;
    }): Promise<{
        PlayId: number;
        ChirpIfPlayingSwappableAudio: boolean;
    }>;
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
