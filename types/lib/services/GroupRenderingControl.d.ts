export = GroupRenderingControl;
/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class GroupRenderingControl extends Service {
    constructor(host: any, port: any);
    GetGroupMute(): Promise<any>;
    SetGroupMute(DesiredMute: any): Promise<any>;
    GetGroupVolume(): Promise<any>;
    SetGroupVolume(DesiredVolume: any): Promise<any>;
    SetRelativeGroupVolume(Adjustment: any): Promise<any>;
    SnapshotGroupVolume(): Promise<any>;
}
import Service = require("./Service");
