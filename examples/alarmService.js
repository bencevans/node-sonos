var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.52')

var alarmService = sonos.alarmClockService()

alarmService.ListAlarms((err, res) => {
  if (err) {
    console.log('Error loading alarms from %s %j', sonos.host, err)
    return
  }
  console.log('Got alarms %s', JSON.stringify(res, null, 2))
})
