export = ConnectionManagerService;
/**
 * Sonos ConnectionManagerService
 *
 * Services related to connections and protocols
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class ConnectionManagerService
 * @extends {Service}
 */
declare class ConnectionManagerService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * GetCurrentConnectionIDs
     * @returns {Promise<Object>} response object, with these properties `ConnectionIDs`
     */
    GetCurrentConnectionIDs(): Promise<any>;
    /**
     * GetCurrentConnectionInfo
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.ConnectionID
     * @returns {Promise<Object>} response object, with these properties `RcsID`, `AVTransportID`, `ProtocolInfo`, `PeerConnectionManager`, `PeerConnectionID`, `Direction`, `Status`
     */
    GetCurrentConnectionInfo(options?: {
        ConnectionID: number;
    }): Promise<any>;
    /**
     * GetProtocolInfo
     * @returns {Promise<Object>} response object, with these properties `Source`, `Sink`
     */
    GetProtocolInfo(): Promise<any>;
}
import Service = require("./Service");
