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
     * @returns {Promise<{ ConnectionIDs: string}>} response object.
     */
    GetCurrentConnectionIDs(): Promise<{
        ConnectionIDs: string;
    }>;
    /**
     * GetCurrentConnectionInfo
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.ConnectionID
     * @returns {Promise<{ RcsID: number, AVTransportID: number, ProtocolInfo: string, PeerConnectionManager: string, PeerConnectionID: number, Direction: string, Status: string}>} response object.
     */
    GetCurrentConnectionInfo(options?: {
        ConnectionID: number;
    }): Promise<{
        RcsID: number;
        AVTransportID: number;
        ProtocolInfo: string;
        PeerConnectionManager: string;
        PeerConnectionID: number;
        Direction: string;
        Status: string;
    }>;
    /**
     * GetProtocolInfo
     * @returns {Promise<{ Source: string, Sink: string}>} response object.
     */
    GetProtocolInfo(): Promise<{
        Source: string;
        Sink: string;
    }>;
}
import Service = require("./Service");
