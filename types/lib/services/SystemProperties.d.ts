export = SystemProperties;
/**
 * Create a new instance of SystemProperties
 * @class SystemProperties
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class SystemProperties extends Service {
    constructor(host: any, port: any);
    SetString(options: any): Promise<any>;
    SetStringX(options: any): Promise<any>;
    GetString(options: any): Promise<any>;
    GetStringX(options: any): Promise<any>;
    Remove(options: any): Promise<any>;
    RemoveX(options: any): Promise<any>;
    GetWebCode(options: any): Promise<any>;
    ProvisionTrialAccount(options: any): Promise<any>;
    ProvisionCredentialedTrialAccountX(options: any): Promise<any>;
    MigrateTrialAccountX(options: any): Promise<any>;
    AddAccountX(options: any): Promise<any>;
    AddAccountWithCredentialsX(options: any): Promise<any>;
    RemoveAccount(options: any): Promise<any>;
    EditAccountPasswordX(options: any): Promise<any>;
    EditAccountMd(options: any): Promise<any>;
    DoPostUpdateTasks(options: any): Promise<any>;
    ResetThirdPartyCredentials(options: any): Promise<any>;
}
import Service = require("./Service");
