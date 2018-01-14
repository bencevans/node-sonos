/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const util = require('util')
const Service = require('./Service')

/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
var AlarmClock = function (host, port) {
  this.name = 'AlarmClock'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/AlarmClock/Control'
  this.eventSubURL = '/AlarmClock/Event'
  this.SCPDURL = '/xml/AlarmClock1.xml'
}

util.inherits(AlarmClock, Service)

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
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.CreateAlarm = function (options, callback) {
  // Encode 2 params (they are required anyway, so no checking)
  options.ProgramMetaData = this.htmlEntities(options.ProgramMetaData)
  options.ProgramURI = this.htmlEntities(options.ProgramURI)
  this._request('CreateAlarm', options, callback)
}

/**
 * Delete an alarm
 * @param  {String} id the id of the alarm you want to delete
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.DestroyAlarm = function (id, callback) {
  this._request('DestroyAlarm', {ID: id.toString()}, callback)
}

/**
 * Get all the alarms known to sonos
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.ListAlarms = function (callback) {
  var self = this
  this._request('ListAlarms', {}, (err, data) => {
    if (err) {
      return callback(err, null)
    }

    self._parseKey(data, 'CurrentAlarmList', (err, output) => {
      if (err) return callback(err)
      var alarms = output.Alarms.Alarm
      if (alarms === undefined) {
        alarms = []
      } else if (!Array.isArray(alarms)) {
        alarms = [alarms]
      }
      // For easier reading
      // alarms.forEach(alarm => {
      //   delete alarm.ProgramMetaData
      // })
      delete data.CurrentAlarmList
      data.CurrentAlarmList = alarms
      return callback(null, data)
    })
  })
}

/**
 * Enable/disable an alarm
 * @param  {String} id the id of the alarm you want to set
 * @param  {Boolean} enabled Should the alarm be enabled or not
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.SetAlarm = function (id, enabled, callback) {
  this.PatchAlarm(id, {Enabled: (enabled ? '1' : '0')}, callback)
}

/**
 * Update only some properties of an Alarm
 * @param  {String} id the id of the alarm you want to update
 * @param  {Object} [options] An object with the settings you wish to update
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
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.PatchAlarm = function (id, options, callback) {
  this.debug('AlarmClock.PatchAlarm(%j %j)', id, options)
  var self = this
  id = id.toString()
  this.ListAlarms((err, data) => {
    if (err) return callback(err)
    self.debug('Got %d alarms in the system', data.CurrentAlarmList.length)
    var targetAlarm = null

    for (let alarm of data.CurrentAlarmList) {
      if (alarm.ID === id) {
        targetAlarm = alarm
        break
      }
    }

    if (!targetAlarm) return callback(new Error('Alarm not found'), null)
    self.debug('Found alarm %j', targetAlarm)
    // Take alterations from options, by going through all the keys and checking if they exists in the options.
    Object.keys(targetAlarm).forEach((key) => { // (key,index,arr) =>{
      if (key !== 'ID' && options.hasOwnProperty(key)) {
        targetAlarm[key] = options[key]
      }
    })

    // Convert the ProgramMetaData and the ProgramURI to some valid xml.
    targetAlarm.ProgramMetaData = self.htmlEntities(targetAlarm.ProgramMetaData)
    targetAlarm.ProgramURI = self.htmlEntities(targetAlarm.ProgramURI)

    // The list alarms gives back StartTime, but the update statement expects 'StartLocalTime', why???
    targetAlarm.StartLocalTime = targetAlarm.StartTime
    delete targetAlarm.StartTime

    return self.UpdateAlarm(targetAlarm, callback)
  })
}

// These are all the possible functions, but they need some work to use.
AlarmClock.prototype.SetFormat = function (options, callback) { this._request('SetFormat', options, callback) }
AlarmClock.prototype.GetFormat = function (options, callback) { this._request('GetFormat', options, callback) }
AlarmClock.prototype.SetTimeZone = function (options, callback) { this._request('SetTimeZone', options, callback) }
AlarmClock.prototype.GetTimeZone = function (options, callback) { this._request('GetTimeZone', options, callback) }
AlarmClock.prototype.GetTimeZoneAndRule = function (options, callback) { this._request('GetTimeZoneAndRule', options, callback) }
AlarmClock.prototype.GetTimeZoneRule = function (options, callback) { this._request('GetTimeZoneRule', options, callback) }
AlarmClock.prototype.SetTimeServer = function (options, callback) { this._request('SetTimeServer', options, callback) }
AlarmClock.prototype.GetTimeServer = function (options, callback) { this._request('GetTimeServer', options, callback) }
AlarmClock.prototype.SetTimeNow = function (options, callback) { this._request('SetTimeNow', options, callback) }
AlarmClock.prototype.GetHouseholdTimeAtStamp = function (options, callback) { this._request('GetHouseholdTimeAtStamp', options, callback) }
AlarmClock.prototype.GetTimeNow = function (options, callback) { this._request('GetTimeNow', options, callback) }
AlarmClock.prototype.UpdateAlarm = function (options, callback) { this._request('UpdateAlarm', options, callback) }
AlarmClock.prototype.SetDailyIndexRefreshTime = function (options, callback) { this._request('SetDailyIndexRefreshTime', options, callback) }
AlarmClock.prototype.GetDailyIndexRefreshTime = function (options, callback) { this._request('GetDailyIndexRefreshTime', options, callback) }

module.exports = AlarmClock
