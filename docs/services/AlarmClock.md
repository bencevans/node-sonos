# AlarmClock

A service to modify everything related to Alarms

**Requires:**

+ module:'./Service'

* * *

## Class: AlarmClock

Create a new instance of AlarmClock

### AlarmClock.AlarmClock.CreateAlarm(options, callback)

Create an alarm, but using the sonos app it advised (because you most likely cannot set the ProgramMetaData correctly)

**Parameters**:

**options**: `Object`, An object with all the required settings

+ **options.StartLocalTime**: `String`, Time string when you want the alarm to sound.

+ **options.Duration**: `String`, How many minutes should the alarm sound.

+ **options.Recurrance**: `String`, What should the recurrence be ['DAILY','ONCE','WEEKDAYS']

+ **options.Enabled**: `String`, Should the alarm be enabled ['1','0']

+ **options.RoomUUID**: `String`, The UUID of the room `RINCON_xxxxxxxxxxxx01400`

+ **options.ProgramURI**: `String`, The programUri you want, this is the difficult part. `x-rincon-buzzer:0` for ringer

+ **options.ProgramMetaData**: `String`, The metadata for the programURI, this is the hard part.

+ **options.PlayMode**: `String`, The playmode ['??','SHUFFLE']

+ **options.Volume**: `String`, What should the volume be

+ **options.IncludeLinkedZones**: `String`, Should linked zones be included? ['0', '1']

**callback**: `function`, (err, result)

**Returns**: `void`

### AlarmClock.AlarmClock.DestroyAlarm(id, callback)

Delete an alarm

**Parameters**:

**id**: `String`, the id of the alarm you want to delete

**callback**: `function`, (err, result)

**Returns**: `void`

### AlarmClock.AlarmClock.ListAlarms(callback)

Get all the alarms known to sonos

**Parameters**:

**callback**: `function`, (err, result)

**Returns**: `void`

### AlarmClock.AlarmClock.SetAlarm(id, enabled, callback)

Enable/disable an alarm

**Parameters**:

**id**: `String`, the id of the alarm you want to set

**enabled**: `Boolean`, Should the alarm be enabled or not

**callback**: `function`, (err, result)

**Returns**: `void`

### AlarmClock.AlarmClock.PatchAlarm(id, options, callback)

Update only some properties of an Alarm

**Parameters**:

**id**: `String`, the id of the alarm you want to update

**options**: `Object`, An object with the settings you wish to update

+ **options.StartLocalTime**: `String`, Time string when you want the alarm to sound.

+ **options.Duration**: `String`, How many minutes should the alarm sound.

+ **options.Recurrance**: `String`, What should the recurrence be ['DAILY','ONCE','WEEKDAYS']

+ **options.Enabled**: `String`, Should the alarm be enabled ['1','0']

+ **options.RoomUUID**: `String`, The UUID of the room `RINCON_xxxxxxxxxxxx01400`

+ **options.ProgramURI**: `String`, The programUri you want, this is the difficult part. `x-rincon-buzzer:0` for ringer

+ **options.ProgramMetaData**: `String`, The metadata for the programURI, this is the hard part.

+ **options.PlayMode**: `String`, The playmode ['??','SHUFFLE']

+ **options.Volume**: `String`, What should the volume be

+ **options.IncludeLinkedZones**: `String`, Should linked zones be included? ['0', '1']

**callback**: `function`, (err, result)

**Returns**: `void`

* * *
