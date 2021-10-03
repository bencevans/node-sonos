/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires '../Helpers'
 */
const Service = require('./Service')
const Helpers = require('../helpers')

/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class AlarmClock extends Service {
  constructor (host, port) {
    super()
    this.name = 'AlarmClock'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/AlarmClock/Control'
    this.eventSubURL = '/AlarmClock/Event'
    this.SCPDURL = '/xml/AlarmClock1.xml'
  }

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
  async CreateAlarm (options) {
  // Encode 2 params (they are required anyway, so no checking)
    options.ProgramMetaData = Helpers.EncodeXml(options.ProgramMetaData)
    options.ProgramURI = Helpers.EncodeXml(options.ProgramURI)
    return this._request('CreateAlarm', options)
  }

  /**
   * Delete an alarm
   * @param  {String} id the id of the alarm you want to delete
   * @returns {Promise<Object>} parsed response object
   */
  async DestroyAlarm (id) {
    return this._request('DestroyAlarm', { ID: id.toString() })
  }

  /**
   * Get all the alarms known to sonos
   * @return {Promise<Object>}
   */
  async ListAlarms () {
    return this._request('ListAlarms', {})
      .then(async result => {
        const alarmResponse = await Helpers.ParseXml(result.CurrentAlarmList)
        if (alarmResponse.Alarms.Alarm === undefined) alarmResponse.Alarms.Alarm = []
        else if (!Array.isArray(alarmResponse.Alarms.Alarm)) alarmResponse.Alarms.Alarm = [alarmResponse.Alarms.Alarm]
        delete result.CurrentAlarmList
        result.Alarms = alarmResponse.Alarms.Alarm
        return result
      })
  }

  /**
   * Enable/disable an alarm
   * @param  {String} id the id of the alarm you want to set
   * @param  {Boolean} enabled Should the alarm be enabled or not
   * @returns {Promise<Object>} parsed response object
   */
  async SetAlarm (id, enabled) {
    return this.PatchAlarm(id, { Enabled: (enabled ? '1' : '0') })
  }

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
  async PatchAlarm (id, options) {
    this.debug('AlarmClock.PatchAlarm(%j %j)', id, options)
    if (typeof (id) !== 'string') throw new Error(`The id should be a string and not a ${typeof (id)}`)
    return this.ListAlarms()
      .then(result => {
        const targetAlarm = result.Alarms.find((alarm) => { return alarm.ID === id })
        if (!targetAlarm) return new Error(`Alarm with id ${id} not found`)
        else {
          Object.keys(targetAlarm).forEach((key) => { // (key,index,arr) =>{
            if (key !== 'ID' && Object.prototype.hasOwnProperty.call(options, key)) {
              targetAlarm[key] = options[key]
            }
          })

          targetAlarm.ProgramMetaData = Helpers.EncodeXml(targetAlarm.ProgramMetaData)
          targetAlarm.ProgramURI = Helpers.EncodeXml(targetAlarm.ProgramURI)

          // The list alarms gives back StartTime, but the update statement expects 'StartLocalTime', why???
          targetAlarm.StartLocalTime = targetAlarm.StartTime
          delete targetAlarm.StartTime
          return this.UpdateAlarm(targetAlarm)
        }
      })
  }

  // These are all the possible functions, but they need some work to use.
  async SetFormat (options) { return this._request('SetFormat', options) }

  async GetFormat (options) { return this._request('GetFormat', options) }

  async SetTimeZone (options) { return this._request('SetTimeZone', options) }

  async GetTimeZone (options) { return this._request('GetTimeZone', options) }

  async GetTimeZoneAndRule (options) { return this._request('GetTimeZoneAndRule', options) }

  async GetTimeZoneRule (options) { return this._request('GetTimeZoneRule', options) }

  async SetTimeServer (options) { return this._request('SetTimeServer', options) }

  async GetTimeServer (options) { return this._request('GetTimeServer', options) }

  async SetTimeNow (options) { return this._request('SetTimeNow', options) }

  async GetHouseholdTimeAtStamp (options) { return this._request('GetHouseholdTimeAtStamp', options) }

  async GetTimeNow (options) { return this._request('GetTimeNow', options) }

  async UpdateAlarm (options) { return this._request('UpdateAlarm', options) }

  async SetDailyIndexRefreshTime (options) { return this._request('SetDailyIndexRefreshTime', options) }

  async GetDailyIndexRefreshTime (options) { return this._request('GetDailyIndexRefreshTime', options) }
}

module.exports = AlarmClock
