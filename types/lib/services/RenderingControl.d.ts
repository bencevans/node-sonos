export = RenderingControl;
/**
 * Create a new instance of RenderingControl
 * @class RenderingControl
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class RenderingControl extends Service {
    constructor(host: any, port: any);
    /**
     * Get the volume
     * @param {string} channel Get to volume for this channel, `Master` is default.
     */
    GetVolume(channel?: string): Promise<any>;
    /**
     * Set the volume for a speaker.
     * @param {number} volume The volume you want (0-100)
     * @param {string} channel The channel you want to set `Master` is default
     */
    SetVolume(volume: number, channel?: string): Promise<any>;
    /**
     * Adjust volume with relative value
     * @param {number} volumeAdjustment The volume adjustment
     * @param {string} channel The channel you want to set. `Master` is default
     */
    SetRelativeVolume(volumeAdjustment: number, channel?: string): Promise<any>;
    /**
     * Check if the speaker is muted
     * @param {string} channel What channel do you want to check? `Master` is default.
     */
    GetMute(channel?: string): Promise<any>;
    /**
     * (Un)mute the volume of a speaker.
     * @param {boolean} mute Should it be muted or unmuted?
     * @param {string} channel The channel you want to set. `Master` is default
     */
    SetMute(mute: boolean, channel?: string): Promise<any>;
    /**
     * Get loudness value of a speaker.
     * @param {string} Channel What channel do you want to check? `Master` is default
     */
    GetLoudness(Channel?: string): Promise<any>;
    /**
     * (Un)set loudness of a speaker.
     * @param {boolean} loudness Should it be with or without loudness?
     * @param {string} Channel The channel you want to set. `Master` is default
     */
    SetLoudness(loudness: boolean, Channel?: string): Promise<any>;
    /**
     * Get bass value of a speaker.
     */
    GetBass(): Promise<any>;
    /**
     * Set bass of a speaker.
     * @param {Number} bass desired level of bass, range from -10 to +10
     */
    SetBass(bass: number): Promise<any>;
    /**
     * Get treble value of a speaker.
     */
    GetTreble(): Promise<any>;
    /**
     * Set treble of a speaker.
     * @param {Number} treble desired level of treble, range from -10 to +10
     */
    SetTreble(treble: number): Promise<any>;
    /**
     * Get room calibration status, response payload is { RoomCalibrationEnabled, RoomCalibrationAvailable }
     */
    GetRoomCalibrationStatus(): Promise<any>;
    /**
     * (Un)set room calibration status (TruePlay) of a speaker.
     * @param {boolean} enabled Should it be with or without truePlay?
     */
    SetRoomCalibrationStatus(enabled: boolean): Promise<any>;
}
import Service = require("./Service");
