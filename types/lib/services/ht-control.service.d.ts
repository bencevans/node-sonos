export = HTControlService;
/**
 * Sonos HTControlService
 *
 * Service related to the TV remote control
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class HTControlService
 * @extends {Service}
 */
declare class HTControlService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * CommitLearnedIRCodes
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.Name
     * @returns {Promise<Boolean>} request succeeded
     */
    CommitLearnedIRCodes(options?: {
        Name: string;
    }): Promise<boolean>;
    /**
     * GetIRRepeaterState
     * @returns {Promise<{ CurrentIRRepeaterState: string}>} response object.
     */
    GetIRRepeaterState(): Promise<{
        CurrentIRRepeaterState: string;
    }>;
    /**
     * GetLEDFeedbackState
     * @returns {Promise<{ LEDFeedbackState: string}>} response object.
     */
    GetLEDFeedbackState(): Promise<{
        LEDFeedbackState: string;
    }>;
    /**
     * IdentifyIRRemote
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Timeout
     * @returns {Promise<Boolean>} request succeeded
     */
    IdentifyIRRemote(options?: {
        Timeout: number;
    }): Promise<boolean>;
    /**
     * IsRemoteConfigured
     * @returns {Promise<{ RemoteConfigured: boolean}>} response object.
     */
    IsRemoteConfigured(): Promise<{
        RemoteConfigured: boolean;
    }>;
    /**
     * LearnIRCode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.IRCode
     * @param {number} options.Timeout
     * @returns {Promise<Boolean>} request succeeded
     */
    LearnIRCode(options?: {
        IRCode: string;
        Timeout: number;
    }): Promise<boolean>;
    /**
     * SetIRRepeaterState
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredIRRepeaterState [ 'On' / 'Off' / 'Disabled' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    SetIRRepeaterState(options?: {
        DesiredIRRepeaterState: string;
    }): Promise<boolean>;
    /**
     * SetLEDFeedbackState
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.LEDFeedbackState [ 'On' / 'Off' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    SetLEDFeedbackState(options?: {
        LEDFeedbackState: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
