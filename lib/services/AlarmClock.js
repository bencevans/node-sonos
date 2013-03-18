
var AlarmClock = function(host, port) {
  this.name = 'AlarmClock';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/AlarmClock/Control';
  this.eventSubURL = '/MediaRenderer/AlarmClock/Event';
  this.SCPDURL = '/xml/AlarmClock1.xml';
};

require('util').inherits(AlarmClock, require('./Service'));

AlarmClock.prototype.SetFormat = function(options, callback) { this._request('SetFormat', options, callback); };
AlarmClock.prototype.GetFormat = function(options, callback) { this._request('GetFormat', options, callback); };
AlarmClock.prototype.SetTimeZone = function(options, callback) { this._request('SetTimeZone', options, callback); };
AlarmClock.prototype.GetTimeZone = function(options, callback) { this._request('GetTimeZone', options, callback); };
AlarmClock.prototype.GetTimeZoneAndRule = function(options, callback) { this._request('GetTimeZoneAndRule', options, callback); };
AlarmClock.prototype.GetTimeZoneRule = function(options, callback) { this._request('GetTimeZoneRule', options, callback); };
AlarmClock.prototype.SetTimeServer = function(options, callback) { this._request('SetTimeServer', options, callback); };
AlarmClock.prototype.GetTimeServer = function(options, callback) { this._request('GetTimeServer', options, callback); };
AlarmClock.prototype.SetTimeNow = function(options, callback) { this._request('SetTimeNow', options, callback); };
AlarmClock.prototype.GetHouseholdTimeAtStamp = function(options, callback) { this._request('GetHouseholdTimeAtStamp', options, callback); };
AlarmClock.prototype.GetTimeNow = function(options, callback) { this._request('GetTimeNow', options, callback); };
AlarmClock.prototype.CreateAlarm = function(options, callback) { this._request('CreateAlarm', options, callback); };
AlarmClock.prototype.UpdateAlarm = function(options, callback) { this._request('UpdateAlarm', options, callback); };
AlarmClock.prototype.DestroyAlarm = function(options, callback) { this._request('DestroyAlarm', options, callback); };
AlarmClock.prototype.ListAlarms = function(options, callback) { this._request('ListAlarms', options, callback); };
AlarmClock.prototype.SetDailyIndexRefreshTime = function(options, callback) { this._request('SetDailyIndexRefreshTime', options, callback); };
AlarmClock.prototype.GetDailyIndexRefreshTime = function(options, callback) { this._request('GetDailyIndexRefreshTime', options, callback); };

module.exports = AlarmClock;