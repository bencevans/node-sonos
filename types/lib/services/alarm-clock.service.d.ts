export = AlarmClockService;
/**
 * Sonos AlarmClockService
 *
 * Control the sonos alarms and times
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class AlarmClockService
 * @extends {Service}
 */
declare class AlarmClockService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * CreateAlarm - Create a single alarm, all properties are required
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.StartLocalTime - The start time as `hh:mm:ss`
     * @param {string} options.Duration - The duration as `hh:mm:ss`
     * @param {string} options.Recurrence - Repeat this alarm on [ 'ONCE' / 'WEEKDAYS' / 'WEEKENDS' / 'DAILY' ]
     * @param {boolean} options.Enabled - Alarm enabled after creation
     * @param {string} options.RoomUUID - The UUID of the speaker you want this alarm for
     * @param {string} options.ProgramURI - The sound uri
     * @param {string} options.ProgramMetaData - The sound metadata, can be empty string
     * @param {string} options.PlayMode - Alarm play mode [ 'NORMAL' / 'REPEAT_ALL' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' ]
     * @param {number} options.Volume - Volume between 0 and 100
     * @param {boolean} options.IncludeLinkedZones - Should grouped players also play the alarm?
     * @returns {Promise<Object>} response object, with these properties `AssignedID`
     */
    CreateAlarm(options?: {
        StartLocalTime: string;
        Duration: string;
        Recurrence: string;
        Enabled: boolean;
        RoomUUID: string;
        ProgramURI: string;
        ProgramMetaData: string;
        PlayMode: string;
        Volume: number;
        IncludeLinkedZones: boolean;
    }): Promise<any>;
    /**
     * DestroyAlarm - Delete an alarm
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.ID - The Alarm ID from ListAlarms
     * @returns {Promise<Boolean>} request succeeded
     */
    DestroyAlarm(options?: {
        ID: number;
    }): Promise<boolean>;
    /**
     * GetDailyIndexRefreshTime
     * @returns {Promise<Object>} response object, with these properties `CurrentDailyIndexRefreshTime`
     */
    GetDailyIndexRefreshTime(): Promise<any>;
    /**
     * GetFormat
     * @returns {Promise<Object>} response object, with these properties `CurrentTimeFormat`, `CurrentDateFormat`
     */
    GetFormat(): Promise<any>;
    /**
     * GetHouseholdTimeAtStamp
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.TimeStamp
     * @returns {Promise<Object>} response object, with these properties `HouseholdUTCTime`
     */
    GetHouseholdTimeAtStamp(options?: {
        TimeStamp: string;
    }): Promise<any>;
    /**
     * GetTimeNow
     * @returns {Promise<Object>} response object, with these properties `CurrentUTCTime`, `CurrentLocalTime`, `CurrentTimeZone`, `CurrentTimeGeneration`
     */
    GetTimeNow(): Promise<any>;
    /**
     * GetTimeServer
     * @returns {Promise<Object>} response object, with these properties `CurrentTimeServer`
     */
    GetTimeServer(): Promise<any>;
    /**
     * GetTimeZone
     * @returns {Promise<Object>} response object, with these properties `Index`, `AutoAdjustDst`
     */
    GetTimeZone(): Promise<any>;
    /**
     * GetTimeZoneAndRule
     * @returns {Promise<Object>} response object, with these properties `Index`, `AutoAdjustDst`, `CurrentTimeZone`
     */
    GetTimeZoneAndRule(): Promise<any>;
    /**
     * GetTimeZoneRule
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Index
     * @returns {Promise<Object>} response object, with these properties `TimeZone`
     */
    GetTimeZoneRule(options?: {
        Index: number;
    }): Promise<any>;
    /**
     * ListAlarms - Get the AlarmList as XML
     * @remarks Some libraries also provide a ListAndParseAlarms where the alarm list xml is parsed
     * @returns {Promise<Object>} response object, with these properties `CurrentAlarmList`, `CurrentAlarmListVersion`
     */
    ListAlarms(): Promise<any>;
    /**
     * SetDailyIndexRefreshTime
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredDailyIndexRefreshTime
     * @returns {Promise<Boolean>} request succeeded
     */
    SetDailyIndexRefreshTime(options?: {
        DesiredDailyIndexRefreshTime: string;
    }): Promise<boolean>;
    /**
     * SetFormat
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredTimeFormat
     * @param {string} options.DesiredDateFormat
     * @returns {Promise<Boolean>} request succeeded
     */
    SetFormat(options?: {
        DesiredTimeFormat: string;
        DesiredDateFormat: string;
    }): Promise<boolean>;
    /**
     * SetTimeNow
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredTime
     * @param {string} options.TimeZoneForDesiredTime
     * @returns {Promise<Boolean>} request succeeded
     */
    SetTimeNow(options?: {
        DesiredTime: string;
        TimeZoneForDesiredTime: string;
    }): Promise<boolean>;
    /**
     * SetTimeServer
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredTimeServer
     * @returns {Promise<Boolean>} request succeeded
     */
    SetTimeServer(options?: {
        DesiredTimeServer: string;
    }): Promise<boolean>;
    /**
     * SetTimeZone
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Index
     * @param {boolean} options.AutoAdjustDst
     * @returns {Promise<Boolean>} request succeeded
     */
    SetTimeZone(options?: {
        Index: number;
        AutoAdjustDst: boolean;
    }): Promise<boolean>;
    /**
     * UpdateAlarm - Update an alarm, all parameters are required.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.ID - The ID of the alarm see ListAlarms
     * @param {string} options.StartLocalTime - The start time as `hh:mm:ss`
     * @param {string} options.Duration - The duration as `hh:mm:ss`
     * @param {string} options.Recurrence - Repeat this alarm on [ 'ONCE' / 'WEEKDAYS' / 'WEEKENDS' / 'DAILY' ]
     * @param {boolean} options.Enabled - Alarm enabled after creation
     * @param {string} options.RoomUUID - The UUID of the speaker you want this alarm for
     * @param {string} options.ProgramURI - The sound uri
     * @param {string} options.ProgramMetaData - The sound metadata, can be empty string
     * @param {string} options.PlayMode - Alarm play mode [ 'NORMAL' / 'REPEAT_ALL' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' ]
     * @param {number} options.Volume - Volume between 0 and 100
     * @param {boolean} options.IncludeLinkedZones - Should grouped players also play the alarm?
     * @remarks Some libraries support PatchAlarm where you can update a single parameter
     * @returns {Promise<Boolean>} request succeeded
     */
    UpdateAlarm(options?: {
        ID: number;
        StartLocalTime: string;
        Duration: string;
        Recurrence: string;
        Enabled: boolean;
        RoomUUID: string;
        ProgramURI: string;
        ProgramMetaData: string;
        PlayMode: string;
        Volume: number;
        IncludeLinkedZones: boolean;
    }): Promise<boolean>;
}
import Service = require("./Service");
