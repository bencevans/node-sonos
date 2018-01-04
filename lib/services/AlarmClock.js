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
AlarmClock.prototype.SetAlarm = function (alarmId, enabled, callback) {
  var self = this
  alarmId = alarmId.toString()
  this.ListAlarms((err, data) => {
    if (err) return callback(err)
    debug('Found %d alarms %s', data.CurrentAlarmList.length, typeof data.CurrentAlarmList)
    var targetAlarm = null

    data.CurrentAlarmList.forEach(alarm => {
      debug('Alarm %j', alarm)
      if (alarm.ID === alarmId) {
        targetAlarm = alarm
        return false
      }
    })

    if (!targetAlarm) return callback(new Error('Alarm not found'), null)
    debug('Found alarm %j', targetAlarm)
    targetAlarm.Enabled = (enabled ? '1' : '0')
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
