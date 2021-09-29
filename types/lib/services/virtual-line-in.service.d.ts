export = VirtualLineInService;
/**
 * Sonos VirtualLineInService
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class VirtualLineInService
 * @extends {Service}
 */
declare class VirtualLineInService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * Next
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @returns {Promise<Boolean>} request succeeded
     */
    Next(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * Pause
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @returns {Promise<Boolean>} request succeeded
     */
    Pause(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * Play
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @param {string} options.Speed
     * @returns {Promise<Boolean>} request succeeded
     */
    Play(options?: {
        InstanceID: number;
        Speed: string;
    }): Promise<boolean>;
    /**
     * Previous
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @returns {Promise<Boolean>} request succeeded
     */
    Previous(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * SetVolume
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @param {number} options.DesiredVolume
     * @returns {Promise<Boolean>} request succeeded
     */
    SetVolume(options?: {
        InstanceID: number;
        DesiredVolume: number;
    }): Promise<boolean>;
    /**
     * StartTransmission
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @param {string} options.CoordinatorID
     * @returns {Promise<Object>} response object, with these properties `CurrentTransportSettings`
     */
    StartTransmission(options?: {
        InstanceID: number;
        CoordinatorID: string;
    }): Promise<any>;
    /**
     * Stop
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @returns {Promise<Boolean>} request succeeded
     */
    Stop(options?: {
        InstanceID: number;
    }): Promise<boolean>;
    /**
     * StopTransmission
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.InstanceID
     * @param {string} options.CoordinatorID
     * @returns {Promise<Boolean>} request succeeded
     */
    StopTransmission(options?: {
        InstanceID: number;
        CoordinatorID: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
