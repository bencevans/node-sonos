export = AudioIn;
/**
 * Create a new instance of AudioIn
 * @class AudioIn
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class AudioIn extends Service {
    constructor(host: any, port: any);
    StartTransmissionToGroup(options: any): Promise<any>;
    StopTransmissionToGroup(options: any): Promise<any>;
    SetAudioInputAttributes(options: any): Promise<any>;
    GetAudioInputAttributes(options: any): Promise<any>;
    SetLineInLevel(options: any): Promise<any>;
    GetLineInLevel(options: any): Promise<any>;
    SelectAudio(options: any): Promise<any>;
}
import Service = require("./Service");
