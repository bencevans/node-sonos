export = Service;
/**
 * Create a new instance of Service
 * @class Service
 * @param {Object} [options] All the required options to use this class
 * @param {String} options.host The host param of one of your sonos speakers
 * @param {Number} options.port The port of your sonos speaker, defaults to 1400
 * @param {String} options.controlURL The control url used for the calls
 * @param {String} options.eventURL The Event URL used for the calls
 * @param {String} options.SCPDURL The SCPDURL (ask Ben)
 */
declare class Service {
    constructor(options?: {});
    name: any;
    host: any;
    port: any;
    controlURL: any;
    eventSubURL: any;
    SCPDURL: any;
    debug: any;
    /**
     * Call the UPNP action
     * @param {String} action The action you want to call
     * @param {Object} variables If this endpoint requires options, put them in here. Otherwise `{ }`
     * @returns {Object} The result of the request.
     */
    _request(action: string, variables: any): any;
    /**
     * Parse a key from the response.
     * @param {Object} input The complete response
     * @param {String} key The key you want parsed
     * @param  {Function} callback (err, result)
     * @return {void}
     */
    _parseKey(input: any, key: string, callback: Function): void;
}
