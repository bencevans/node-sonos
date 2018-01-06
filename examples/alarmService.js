var Sonos = require('../').Sonos
var sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.52')

var alarmService = sonos.alarmClockService()

alarmService.ListAlarms((err, res) => {
  if (err) {
    console.log('Error loading alarms from %s %j', sonos.host, err)
    return
  }
  console.log('Got alarms %s', JSON.stringify(res, null, 2))
  // // Make sure your friends come late for work, no, not a good idea (but you could!)
  // res.CurrentAlarmList.array.forEach(alarm => {
  //   if (alarm.Enabled === '1') {
  //     alarmService.SetAlarm(alarm.ID, false, (err, result) => {
  //       if(err) console.log('Got error %j',err)
  //       console.log('Alarm %s disabled', alarm.ID)
  //     })
  //   }
  // })
})

// // Disable an alarm by ID
// var alarmId = 76
// alarmService.SetAlarm(alarmId, false, (err, res) => {
//   if (err) {
//     console.log('Error disabeling alarm %d %j', alarmId, err)
//     return
//   }
//   console.log('Response %s', JSON.stringify(res, null, 2))
// })
