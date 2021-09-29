export = GroupRenderingControlService;
/**
 * Sonos GroupRenderingControlService
 *
 * Volume related controls for groups
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class GroupRenderingControlService
 * @extends {Service}
 */
declare class GroupRenderingControlService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * GetGroupMute - Get the group mute state.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Should be send to coordinator only
     * @returns {Promise<Object>} response object, with these properties `CurrentMute`
     */
    GetGroupMute(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * GetGroupVolume - Get the group volume.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Should be send to coordinator only
     * @returns {Promise<Object>} response object, with these properties `CurrentVolume`
     */
    GetGroupVolume(options?: {
        InstanceID: number;
    }): Promise<any>;
    /**
     * SetGroupMute - (Un-/)Mute the entire group
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {boolean} options.DesiredMute
     * @remarks Should be send to coordinator only
     * @returns {Promise<Boolean>} request succeeded
     */
    SetGroupMute(options?: {
        InstanceID: number;
        DesiredMute: boolean;
    }): Promise<boolean>;
    /**
     * SetGroupVolume - Change group volume. Players volume will be changed proportionally based on last snapshot
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.DesiredVolume - New volume between 0 and 100
     * @remarks Should be send to coordinator only
     * @returns {Promise<Boolean>} request succeeded
     */
    SetGroupVolume(options?: {
        InstanceID: number;
        DesiredVolume: number;
    }): Promise<boolean>;
    /**
     * SetRelativeGroupVolume - Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @param {number} options.Adjustment - Number between -100 and +100
     * @remarks Should be send to coordinator only
     * @returns {Promise<Object>} response object, with these properties `NewVolume`
     */
    SetRelativeGroupVolume(options?: {
        InstanceID: number;
        Adjustment: number;
    }): Promise<any>;
    /**
     * SnapshotGroupVolume - Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID - InstanceID should always be `0`
     * @remarks Should be send to coordinator only
     * @returns {Promise<Boolean>} request succeeded
     */
    SnapshotGroupVolume(options?: {
        InstanceID: number;
    }): Promise<boolean>;
}
import Service = require("./Service");
