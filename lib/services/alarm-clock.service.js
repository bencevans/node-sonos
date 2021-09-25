const Service = require('./Service')
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
class AlarmClockService extends Service {
  constructor (host, port) {
    super()
    this.name = 'AlarmClock'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/AlarmClock/Control'
    this.eventSubURL = '/AlarmClock/Event'
    this.SCPDURL = '/xml/AlarmClock1.xml'
  }

  // #region actions
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
   * @returns {Object} response object, with these properties 'AssignedID'
   */
  async CreateAlarm (options) { return this._request('CreateAlarm', options) }

  /**
   * DestroyAlarm - Delete an alarm
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.ID - The Alarm ID from ListAlarms
   */
  async DestroyAlarm (options) { return this._request('DestroyAlarm', options) }

  /**
   * GetDailyIndexRefreshTime
   * @returns {Object} response object, with these properties 'CurrentDailyIndexRefreshTime'
   */
  async GetDailyIndexRefreshTime () { return this._request('GetDailyIndexRefreshTime') }

  /**
   * GetFormat
   * @returns {Object} response object, with these properties 'CurrentTimeFormat', 'CurrentDateFormat'
   */
  async GetFormat () { return this._request('GetFormat') }

  /**
   * GetHouseholdTimeAtStamp
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.TimeStamp
   * @returns {Object} response object, with these properties 'HouseholdUTCTime'
   */
  async GetHouseholdTimeAtStamp (options) { return this._request('GetHouseholdTimeAtStamp', options) }

  /**
   * GetTimeNow
   * @returns {Object} response object, with these properties 'CurrentUTCTime', 'CurrentLocalTime', 'CurrentTimeZone', 'CurrentTimeGeneration'
   */
  async GetTimeNow () { return this._request('GetTimeNow') }

  /**
   * GetTimeServer
   * @returns {Object} response object, with these properties 'CurrentTimeServer'
   */
  async GetTimeServer () { return this._request('GetTimeServer') }

  /**
   * GetTimeZone
   * @returns {Object} response object, with these properties 'Index', 'AutoAdjustDst'
   */
  async GetTimeZone () { return this._request('GetTimeZone') }

  /**
   * GetTimeZoneAndRule
   * @returns {Object} response object, with these properties 'Index', 'AutoAdjustDst', 'CurrentTimeZone'
   */
  async GetTimeZoneAndRule () { return this._request('GetTimeZoneAndRule') }

  /**
   * GetTimeZoneRule
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.Index
   * @returns {Object} response object, with these properties 'TimeZone'
   */
  async GetTimeZoneRule (options) { return this._request('GetTimeZoneRule', options) }

  /**
   * ListAlarms - Get the AlarmList as XML
   * @remarks Some libraries also provide a ListAndParseAlarms where the alarm list xml is parsed
   * @returns {Object} response object, with these properties 'CurrentAlarmList', 'CurrentAlarmListVersion'
   */
  async ListAlarms () { return this._request('ListAlarms') }

  /**
   * SetDailyIndexRefreshTime
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredDailyIndexRefreshTime
   */
  async SetDailyIndexRefreshTime (options) { return this._request('SetDailyIndexRefreshTime', options) }

  /**
   * SetFormat
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredTimeFormat
   * @param {string} options.DesiredDateFormat
   */
  async SetFormat (options) { return this._request('SetFormat', options) }

  /**
   * SetTimeNow
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredTime
   * @param {string} options.TimeZoneForDesiredTime
   */
  async SetTimeNow (options) { return this._request('SetTimeNow', options) }

  /**
   * SetTimeServer
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.DesiredTimeServer
   */
  async SetTimeServer (options) { return this._request('SetTimeServer', options) }

  /**
   * SetTimeZone
   *
   * @param {Object} [options] - An object with the following properties
   * @param {number} options.Index
   * @param {boolean} options.AutoAdjustDst
   */
  async SetTimeZone (options) { return this._request('SetTimeZone', options) }

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
   */
  async UpdateAlarm (options) { return this._request('UpdateAlarm', options) }
  // #endregion
}

module.exports = AlarmClockService
