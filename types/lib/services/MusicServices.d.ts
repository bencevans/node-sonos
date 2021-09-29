export = MusicServices;
/**
 * Create a new instance of MusicServices
 * @class MusicServices
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class MusicServices extends Service {
    constructor(host: any, port: any);
    GetSessionId(options: any): Promise<any>;
    ListAvailableServices(options: any): Promise<any>;
    UpdateAvailableServices(options: any): Promise<any>;
}
import Service = require("./Service");
