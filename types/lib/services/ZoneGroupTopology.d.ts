export = ZoneGroupTopology;
/**
 * Create a new instance of ZoneGroupTopology
 * @class ZoneGroupTopology
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 * Check http://[sonos_ip]:1400/xml/ZoneGroupTopology1.xml for all actions.
 */
declare class ZoneGroupTopology extends Service {
    constructor(host: any, port: any);
    CheckForUpdate(options: any): Promise<any>;
    BeginSoftwareUpdate(options: any): Promise<any>;
    ReportUnresponsiveDevice(options: any): Promise<any>;
    ReportAlarmStartedRunning(options: any): Promise<any>;
    SubmitDiagnostics(options: any): Promise<any>;
    RegisterMobileDevice(options: any): Promise<any>;
    GetZoneGroupAttributes(): Promise<any>;
    /**
     * Get all the information about the ZoneGroups
     * @returns {Promise<Object>} Object with one property, 'ZoneGroupState'
     */
    GetZoneGroupState(): Promise<any>;
    /**
     * Get all the ZoneGroups
     */
    AllZoneGroups(): Promise<any>;
}
import Service = require("./Service");
