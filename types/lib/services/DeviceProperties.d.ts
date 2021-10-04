export = DeviceProperties;
/**
 * Create a new instance of DeviceProperties
 * @class DeviceProperties
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class DeviceProperties extends Service {
    constructor(host: any, port: any);
    /**
     * Enters config mode
     * @param {string} Mode Use 'button-notify' to listen to then poll the button state via GetButtonState. This can be used to identify left or right of a pair
     * @param {string} Options
     */
    EnterConfigMode(Mode?: string, Options?: string): Promise<any>;
    /**
     * Exits config mode
     * @param {string} Options
     */
    ExitConfigMode(Options?: string): Promise<any>;
    /**
     * Gets button state
     */
    GetButtonState(): Promise<any>;
    SetLEDState(state: any): Promise<any>;
    GetLEDState(): Promise<any>;
    SetInvisible(options: any): Promise<any>;
    GetInvisible(options: any): Promise<any>;
    /**
     * Adds bonded zones
     * @param {object} options Object with required parameters
     * @param {string} options.ChannelMapSet i.e. to create a stereo pair, use `${left.UUID}:LF,LF;${right.UUID}:RF,RF`
     */
    AddBondedZones(options: {
        ChannelMapSet: string;
    }): Promise<any>;
    /**
     * Removes bonded zones
     * @param {object} options Object with required parameters
     * @param {string} options.ChannelMapSet can be empty string
     * @param {Number} options.KeepGrouped 0 or 1
     */
    RemoveBondedZones(options: {
        ChannelMapSet: string;
        KeepGrouped: number;
    }): Promise<any>;
    CreateStereoPair(options: any): Promise<any>;
    SeparateStereoPair(options: any): Promise<any>;
    /**
     * Set the attributes of this speaker
     * @param {object} options Object with required parameters
     * @param {string} options.DesiredZoneName The name of the speaker
     * @param {string} options.DesiredIcon The icon of the speaker
     * @param {string} options.DesiredConfiguration The config of the speaker
     */
    SetZoneAttributes(options: {
        DesiredZoneName: string;
        DesiredIcon: string;
        DesiredConfiguration: string;
    }): Promise<any>;
    GetZoneAttributes(): Promise<any>;
    GetHouseholdID(options: any): Promise<any>;
    GetZoneInfo(): Promise<any>;
    SetAutoplayLinkedZones(options: any): Promise<any>;
    GetAutoplayLinkedZones(options: any): Promise<any>;
    SetAutoplayRoomUUID(options: any): Promise<any>;
    GetAutoplayRoomUUID(options: any): Promise<any>;
    SetAutoplayVolume(options: any): Promise<any>;
    GetAutoplayVolume(options: any): Promise<any>;
    ImportSetting(options: any): Promise<any>;
    SetUseAutoplayVolume(options: any): Promise<any>;
    GetUseAutoplayVolume(options: any): Promise<any>;
    AddHTSatellite(options: any): Promise<any>;
    RemoveHTSatellite(options: any): Promise<any>;
}
import Service = require("./Service");
