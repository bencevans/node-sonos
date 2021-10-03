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
     * @returns {Promise<{ AssignedID: number}>} response object.
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
    }): Promise<{
        AssignedID: number;
    }>;
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
     * @returns {Promise<{ CurrentDailyIndexRefreshTime: string}>} response object.
     */
    GetDailyIndexRefreshTime(): Promise<{
        CurrentDailyIndexRefreshTime: string;
    }>;
    /**
     * GetFormat
     * @returns {Promise<{ CurrentTimeFormat: string, CurrentDateFormat: string}>} response object.
     */
    GetFormat(): Promise<{
        CurrentTimeFormat: string;
        CurrentDateFormat: string;
    }>;
    /**
     * GetHouseholdTimeAtStamp
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.TimeStamp
     * @returns {Promise<{ HouseholdUTCTime: string}>} response object.
     */
    GetHouseholdTimeAtStamp(options?: {
        TimeStamp: string;
    }): Promise<{
        HouseholdUTCTime: string;
    }>;
    /**
     * GetTimeNow
     * @returns {Promise<{ CurrentUTCTime: string, CurrentLocalTime: string, CurrentTimeZone: string, CurrentTimeGeneration: number}>} response object.
     */
    GetTimeNow(): Promise<{
        CurrentUTCTime: string;
        CurrentLocalTime: string;
        CurrentTimeZone: string;
        CurrentTimeGeneration: number;
    }>;
    /**
     * GetTimeServer
     * @returns {Promise<{ CurrentTimeServer: string}>} response object.
     */
    GetTimeServer(): Promise<{
        CurrentTimeServer: string;
    }>;
    /**
     * GetTimeZone
     * @returns {Promise<{ Index: number, AutoAdjustDst: boolean}>} response object.
     */
    GetTimeZone(): Promise<{
        Index: number;
        AutoAdjustDst: boolean;
    }>;
    /**
     * GetTimeZoneAndRule
     * @returns {Promise<{ Index: number, AutoAdjustDst: boolean, CurrentTimeZone: string}>} response object.
     */
    GetTimeZoneAndRule(): Promise<{
        Index: number;
        AutoAdjustDst: boolean;
        CurrentTimeZone: string;
    }>;
    /**
     * GetTimeZoneRule
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.Index
     * @returns {Promise<{ TimeZone: string}>} response object.
     */
    GetTimeZoneRule(options?: {
        Index: number;
    }): Promise<{
        TimeZone: string;
    }>;
    /**
     * ListAlarms - Get the AlarmList as XML
     * @remarks Some libraries also provide a ListAndParseAlarms where the alarm list xml is parsed
     * @returns {Promise<{ CurrentAlarmList: string, CurrentAlarmListVersion: string}>} response object.
     */
    ListAlarms(): Promise<{
        CurrentAlarmList: string;
        CurrentAlarmListVersion: string;
    }>;
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
