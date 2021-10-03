export = AudioInService;
/**
 * Sonos AudioInService
 *
 * Control line in
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class AudioInService
 * @extends {Service}
 */
declare class AudioInService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * GetAudioInputAttributes
     * @returns {Promise<{ CurrentName: string, CurrentIcon: string}>} response object.
     */
    GetAudioInputAttributes(): Promise<{
        CurrentName: string;
        CurrentIcon: string;
    }>;
    /**
     * GetLineInLevel
     * @returns {Promise<{ CurrentLeftLineInLevel: number, CurrentRightLineInLevel: number}>} response object.
     */
    GetLineInLevel(): Promise<{
        CurrentLeftLineInLevel: number;
        CurrentRightLineInLevel: number;
    }>;
    /**
     * SelectAudio
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.ObjectID
     * @returns {Promise<Boolean>} request succeeded
     */
    SelectAudio(options?: {
        ObjectID: string;
    }): Promise<boolean>;
    /**
     * SetAudioInputAttributes
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredName
     * @param {string} options.DesiredIcon
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAudioInputAttributes(options?: {
        DesiredName: string;
        DesiredIcon: string;
    }): Promise<boolean>;
    /**
     * SetLineInLevel
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.DesiredLeftLineInLevel
     * @param {number} options.DesiredRightLineInLevel
     * @returns {Promise<Boolean>} request succeeded
     */
    SetLineInLevel(options?: {
        DesiredLeftLineInLevel: number;
        DesiredRightLineInLevel: number;
    }): Promise<boolean>;
    /**
     * StartTransmissionToGroup
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.CoordinatorID
     * @returns {Promise<{ CurrentTransportSettings: string}>} response object.
     */
    StartTransmissionToGroup(options?: {
        CoordinatorID: string;
    }): Promise<{
        CurrentTransportSettings: string;
    }>;
    /**
     * StopTransmissionToGroup
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.CoordinatorID
     * @returns {Promise<Boolean>} request succeeded
     */
    StopTransmissionToGroup(options?: {
        CoordinatorID: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
