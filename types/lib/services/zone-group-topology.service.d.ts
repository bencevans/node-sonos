export = ZoneGroupTopologyService;
/**
 * Sonos ZoneGroupTopologyService
 *
 * Zone config stuff, eg getting all the configured sonos zones
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class ZoneGroupTopologyService
 * @extends {Service}
 */
declare class ZoneGroupTopologyService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * BeginSoftwareUpdate
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.UpdateURL
     * @param {number} options.Flags
     * @param {string} options.ExtraOptions
     * @returns {Promise<Boolean>} request succeeded
     */
    BeginSoftwareUpdate(options?: {
        UpdateURL: string;
        Flags: number;
        ExtraOptions: string;
    }): Promise<boolean>;
    /**
     * CheckForUpdate
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.UpdateType [ 'All' / 'Software' ]
     * @param {boolean} options.CachedOnly
     * @param {string} options.Version
     * @returns {Promise<{ UpdateItem: string}>} response object.
     */
    CheckForUpdate(options?: {
        UpdateType: string;
        CachedOnly: boolean;
        Version: string;
    }): Promise<{
        UpdateItem: string;
    }>;
    /**
     * GetZoneGroupAttributes - Get information about the current Zone
     * @returns {Promise<{ CurrentZoneGroupName: string, CurrentZoneGroupID: string, CurrentZonePlayerUUIDsInGroup: string, CurrentMuseHouseholdId: string}>} response object.
     */
    GetZoneGroupAttributes(): Promise<{
        CurrentZoneGroupName: string;
        CurrentZoneGroupID: string;
        CurrentZonePlayerUUIDsInGroup: string;
        CurrentMuseHouseholdId: string;
    }>;
    /**
     * GetZoneGroupState - Get all the Sonos groups, (as XML)
     * @remarks Some libraries also support GetParsedZoneGroupState that parses the xml for you.
     * @returns {Promise<{ ZoneGroupState: string}>} response object.
     */
    GetZoneGroupState(): Promise<{
        ZoneGroupState: string;
    }>;
    /**
     * RegisterMobileDevice
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.MobileDeviceName
     * @param {string} options.MobileDeviceUDN
     * @param {string} options.MobileIPAndPort
     * @returns {Promise<Boolean>} request succeeded
     */
    RegisterMobileDevice(options?: {
        MobileDeviceName: string;
        MobileDeviceUDN: string;
        MobileIPAndPort: string;
    }): Promise<boolean>;
    /**
     * ReportAlarmStartedRunning
     * @returns {Promise<Boolean>} request succeeded
     */
    ReportAlarmStartedRunning(): Promise<boolean>;
    /**
     * ReportUnresponsiveDevice
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DeviceUUID
     * @param {string} options.DesiredAction [ 'Remove' / 'TopologyMonitorProbe' / 'VerifyThenRemoveSystemwide' ]
     * @returns {Promise<Boolean>} request succeeded
     */
    ReportUnresponsiveDevice(options?: {
        DeviceUUID: string;
        DesiredAction: string;
    }): Promise<boolean>;
    /**
     * SubmitDiagnostics
     *
     * @param {Object} [options] - An object with the following properties
     * @param {boolean} options.IncludeControllers
     * @param {string} options.Type
     * @returns {Promise<{ DiagnosticID: number}>} response object.
     */
    SubmitDiagnostics(options?: {
        IncludeControllers: boolean;
        Type: string;
    }): Promise<{
        DiagnosticID: number;
    }>;
}
import Service = require("./Service");
