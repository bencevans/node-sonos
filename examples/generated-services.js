const Sonos = require('../').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.52')

const alarmService = sonos.generatedServices.AlarmClockService()

alarmService.ListAlarms().then(alarmResult => {
  console.log('Current alarms %s', JSON.stringify(alarmResult, null, 2))
}).catch(err => {
  console.log('Error occurred %s', err)
})
