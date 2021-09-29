export = MusicServicesService;
/**
 * Sonos MusicServicesService
 *
 * Access to external music services, like Spotify or Youtube Music
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class MusicServicesService
 * @extends {Service}
 */
declare class MusicServicesService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * GetSessionId
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.ServiceId
     * @param {string} options.Username
     * @returns {Promise<Object>} response object, with these properties `SessionId`
     */
    GetSessionId(options?: {
        ServiceId: number;
        Username: string;
    }): Promise<any>;
    /**
     * ListAvailableServices - Load music service list as xml
     * @remarks Some libraries also support ListAndParseAvailableServices
     * @returns {Promise<Object>} response object, with these properties `AvailableServiceDescriptorList`, `AvailableServiceTypeList`, `AvailableServiceListVersion`
     */
    ListAvailableServices(): Promise<any>;
    /**
     * UpdateAvailableServices
     * @returns {Promise<Boolean>} request succeeded
     */
    UpdateAvailableServices(): Promise<boolean>;
}
import Service = require("./Service");
