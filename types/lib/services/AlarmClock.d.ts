export = AlarmClock;
/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class AlarmClock extends Service {
    constructor(host: any, port: any);
    /**
     * Create an alarm, but using the sonos app it advised (because you most likely cannot set the ProgramMetaData correctly)
     * @param  {Object} [options] An object with all the required settings
     * @param  {String} options.StartLocalTime Time string when you want the alarm to sound.
     * @param  {String} options.Duration How many minutes should the alarm sound.
     * @param  {String} options.Recurrance What should the recurrence be ['DAILY','ONCE','WEEKDAYS']
     * @param  {String} options.Enabled Should the alarm be enabled ['1','0']
     * @param  {String} options.RoomUUID The UUID of the room `RINCON_xxxxxxxxxxxx01400`
     * @param  {String} options.ProgramURI The programUri you want, this is the difficult part. `x-rincon-buzzer:0` for ringer
     * @param  {String} options.ProgramMetaData The metadata for the programURI, this is the hard part.
     * @param  {String} options.PlayMode The playmode ['??','SHUFFLE']
     * @param  {String} options.Volume What should the volume be
     * @param  {String} options.IncludeLinkedZones Should linked zones be included? ['0', '1']
     * @returns {Promise<Object>} parsed response object
     */
    CreateAlarm(options?: {
        StartLocalTime: string;
        Duration: string;
        Recurrance: string;
        Enabled: string;
        RoomUUID: string;
        ProgramURI: string;
        ProgramMetaData: string;
        PlayMode: string;
        Volume: string;
        IncludeLinkedZones: string;
    }): Promise<any>;
    /**
     * Delete an alarm
     * @param  {String} id the id of the alarm you want to delete
     * @returns {Promise<Object>} parsed response object
     */
    DestroyAlarm(id: string): Promise<any>;
    /**
     * Get all the alarms known to sonos
     * @return {Object}
     */
    ListAlarms(): any;
    /**
     * Enable/disable an alarm
     * @param  {String} id the id of the alarm you want to set
     * @param  {Boolean} enabled Should the alarm be enabled or not
     * @returns {Promise<Object>} parsed response object
     */
    SetAlarm(id: string, enabled: boolean): Promise<any>;
    /**
     * Update only some properties of an Alarm
     * @param  {String} id the id of the alarm you want to update
     * @param  {Object} [options] An object with the settings you wish to update
     * @param  {String?} options.StartLocalTime Time string when you want the alarm to sound.
     * @param  {String?} options.Duration How many minutes should the alarm sound.
     * @param  {String?} options.Recurrance What should the recurrence be ['DAILY','ONCE','WEEKDAYS']
     * @param  {String?} options.Enabled Should the alarm be enabled ['1','0']
     * @param  {String?} options.RoomUUID The UUID of the room `RINCON_xxxxxxxxxxxx01400`
     * @param  {String?} options.ProgramURI The programUri you want, this is the difficult part. `x-rincon-buzzer:0` for ringer
     * @param  {String?} options.ProgramMetaData The metadata for the programURI, this is the hard part.
     * @param  {String?} options.PlayMode The playmode ['??','SHUFFLE']
     * @param  {String?} options.Volume What should the volume be
     * @param  {String?} options.IncludeLinkedZones Should linked zones be included? ['0', '1']
     * @returns {Promise<Object>} parsed response object
     */
    PatchAlarm(id: string, options?: {
        StartLocalTime: string | null;
        Duration: string | null;
        Recurrance: string | null;
        Enabled: string | null;
        RoomUUID: string | null;
        ProgramURI: string | null;
        ProgramMetaData: string | null;
        PlayMode: string | null;
        Volume: string | null;
        IncludeLinkedZones: string | null;
    }): Promise<any>;
    SetFormat(options: any): Promise<any>;
    GetFormat(options: any): Promise<any>;
    SetTimeZone(options: any): Promise<any>;
    GetTimeZone(options: any): Promise<any>;
    GetTimeZoneAndRule(options: any): Promise<any>;
    GetTimeZoneRule(options: any): Promise<any>;
    SetTimeServer(options: any): Promise<any>;
    GetTimeServer(options: any): Promise<any>;
    SetTimeNow(options: any): Promise<any>;
    GetHouseholdTimeAtStamp(options: any): Promise<any>;
    GetTimeNow(options: any): Promise<any>;
    UpdateAlarm(options: any): Promise<any>;
    SetDailyIndexRefreshTime(options: any): Promise<any>;
    GetDailyIndexRefreshTime(options: any): Promise<any>;
}
import Service = require("./Service");
