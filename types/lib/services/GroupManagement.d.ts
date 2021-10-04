export = GroupManagement;
/**
 * Create a new instance of GroupManagement
 * @class GroupManagement
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class GroupManagement extends Service {
    constructor(host: any, port: any);
    AddMember(options: any): Promise<any>;
    RemoveMember(options: any): Promise<any>;
    ReportTrackBufferingResult(options: any): Promise<any>;
}
import Service = require("./Service");
