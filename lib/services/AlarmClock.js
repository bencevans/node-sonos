var debug = require('debug')('sonos-service')
var AlarmClock = function (host, port) {
  this.name = 'AlarmClock'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/AlarmClock/Control'
  this.eventSubURL = '/AlarmClock/Event'
  this.SCPDURL = '/xml/AlarmClock1.xml'
}

require('util').inherits(AlarmClock, require('./Service'))

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
AlarmClock.prototype.CreateAlarm = function (options, callback) { this._request('CreateAlarm', options, callback) }
AlarmClock.prototype.UpdateAlarm = function (options, callback) { this._request('UpdateAlarm', options, callback) }
AlarmClock.prototype.DestroyAlarm = function (options, callback) { this._request('DestroyAlarm', options, callback) }
AlarmClock.prototype.ListAlarms = function (callback) {
  var self = this
  this._request('ListAlarms', {}, (err, data) => {
    if (err) {
      callback(err, null)
      return
    }

    self._parseKey(data, 'CurrentAlarmList', (err, output) => {
      if (err) return callback(err)
      var alarms = output.Alarms.Alarm
      // For easier reading
      // alarms.forEach(alarm => {
      //   delete alarm.ProgramMetaData
      // })
      delete data.CurrentAlarmList
      data.CurrentAlarmList = alarms
      callback(null, data)
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
  this.PatchAlarm(id,{Enabled: (enabled ? '1' : '0')}, callback)
}
/**
 * Update only some properties of an Alarm
 * @param  {String} id the id of the alarm you want to update
 * @param  {Object} options {Enabled:'1', StartTime:'08:00:00', ...}
 * @param  {Function} callback (err, result)
 * @return {void}
 */
AlarmClock.prototype.PatchAlarm = function (id, options, callback) {
  debug('AlarmClock.PatchAlarm(%j %j)', id, options)
  var self = this
  id = id.toString()
  this.ListAlarms((err, data) => {
    if (err) return callback(err)
    debug('Found %d alarms', data.CurrentAlarmList.length)
    var targetAlarm = null

    for(let alarm of data.CurrentAlarmList) {
      debug('Alarm %j', alarm)
      if (alarm.ID === id) {
        targetAlarm = alarm
        break
      }
    }

    if (!targetAlarm) return callback(new Error('Alarm not found'), null)
    debug('Found alarm %j', targetAlarm)
    // Take alterations from options
    if(options.Enabled) targetAlarm.Enabled = options.Enabled
    if(options.StartTime) targetAlarm.StartTime = options.StartTime
    if(options.Duration) targetAlarm.Duration = options.Duration
    if(options.Recurrence) targetAlarm.Recurrence = options.Recurrence
    if(options.ProgramURI) targetAlarm.ProgramURI = options.ProgramURI
    if(options.ProgramMetaData) targetAlarm.ProgramMetaData = options.ProgramMetaData
    if(options.PlayMode) targetAlarm.PlayMode = options.PlayMode
    if(options.Volume) targetAlarm.Volume = options.Volume
    if(options.IncludeLinkedZones) targetAlarm.IncludeLinkedZones = options.IncludeLinkedZones


    targetAlarm.ProgramMetaData = self.htmlEntities(targetAlarm.ProgramMetaData)
    targetAlarm.ProgramURI = self.htmlEntities(targetAlarm.ProgramURI)
    targetAlarm.StartLocalTime = targetAlarm.StartTime
    delete targetAlarm.StartTime
    return self.UpdateAlarm(targetAlarm, callback)
  })
}
AlarmClock.prototype.SetDailyIndexRefreshTime = function (options, callback) { this._request('SetDailyIndexRefreshTime', options, callback) }
AlarmClock.prototype.GetDailyIndexRefreshTime = function (options, callback) { this._request('GetDailyIndexRefreshTime', options, callback) }

module.exports = AlarmClock
