const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.52')

const alarmService = sonos.alarmClockService()

alarmService.ListAlarms().then(alarmResult => {
  console.log('You got all the alarms now %j', alarmResult)
  // Make sure your friends come late for work, no, not a good idea (but you could!)
  // var disable = function (alarm) {
  //   return alarmService.SetAlarm(alarm.ID, false)
  // }
  // var disableAll = alarmResult.CurrentAlarmList.map(disable)
  // return Promise.all(disableAll)
}).catch(err => {
  console.log('Error occurred %j', err)
})

// // Disable an alarm by ID
// var alarmId = 76
// alarmService.SetAlarm(alarmId, false).then(res => {
//   console.log('Disabled alarm with id %s', alarmId)
// }).catch(err => {
//   console.log('Error occurred %j', err)
// })
