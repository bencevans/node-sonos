---
layout: default
title: AlarmClock
---
# AlarmClock service

Control the sonos alarms and times

The AlarmClock service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.AlarmClockService().OneOfTheMethodsBelow({...})
```

## Actions

### CreateAlarm

Create a single alarm, all properties are required

```js
const result = await sonos.generatedServices.AlarmClockService.CreateAlarm({ StartLocalTime:..., Duration:..., Recurrence:..., Enabled:..., RoomUUID:..., ProgramURI:..., ProgramMetaData:..., PlayMode:..., Volume:..., IncludeLinkedZones:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **StartLocalTime** | `string` | The start time as `hh:mm:ss` |
| **Duration** | `string` | The duration as `hh:mm:ss` |
| **Recurrence** | `string` | Repeat this alarm on Allowed values: `ONCE` / `WEEKDAYS` / `WEEKENDS` / `DAILY` |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm play mode Allowed values: `NORMAL` / `REPEAT_ALL` / `SHUFFLE_NOREPEAT` / `SHUFFLE` |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped players also play the alarm? |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AssignedID** | `number` | The ID of the new alarm |

### DestroyAlarm

Delete an alarm

```js
const result = await sonos.generatedServices.AlarmClockService.DestroyAlarm({ ID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The Alarm ID from ListAlarms |

This actions returns a boolean whether or not the requests succeeded.

### GetDailyIndexRefreshTime

```js
const result = await sonos.generatedServices.AlarmClockService.GetDailyIndexRefreshTime();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentDailyIndexRefreshTime** | `string` |  |

### GetFormat

```js
const result = await sonos.generatedServices.AlarmClockService.GetFormat();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTimeFormat** | `string` |  |
| **CurrentDateFormat** | `string` |  |

### GetHouseholdTimeAtStamp

```js
const result = await sonos.generatedServices.AlarmClockService.GetHouseholdTimeAtStamp({ TimeStamp:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **TimeStamp** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **HouseholdUTCTime** | `string` |  |

### GetTimeNow

```js
const result = await sonos.generatedServices.AlarmClockService.GetTimeNow();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentUTCTime** | `string` |  |
| **CurrentLocalTime** | `string` |  |
| **CurrentTimeZone** | `string` |  |
| **CurrentTimeGeneration** | `number` |  |

### GetTimeServer

```js
const result = await sonos.generatedServices.AlarmClockService.GetTimeServer();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTimeServer** | `string` |  |

### GetTimeZone

```js
const result = await sonos.generatedServices.AlarmClockService.GetTimeZone();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |

### GetTimeZoneAndRule

```js
const result = await sonos.generatedServices.AlarmClockService.GetTimeZoneAndRule();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |
| **CurrentTimeZone** | `string` |  |

### GetTimeZoneRule

```js
const result = await sonos.generatedServices.AlarmClockService.GetTimeZoneRule({ Index:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **TimeZone** | `string` |  |

### ListAlarms

Get the AlarmList as XML

```js
const result = await sonos.generatedServices.AlarmClockService.ListAlarms();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentAlarmList** | `string` | xml string, see remarks |
| **CurrentAlarmListVersion** | `string` |  |

**Remarks** Some libraries also provide a ListAndParseAlarms where the alarm list xml is parsed

### SetDailyIndexRefreshTime

```js
const result = await sonos.generatedServices.AlarmClockService.SetDailyIndexRefreshTime({ DesiredDailyIndexRefreshTime:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredDailyIndexRefreshTime** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetFormat

```js
const result = await sonos.generatedServices.AlarmClockService.SetFormat({ DesiredTimeFormat:..., DesiredDateFormat:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredTimeFormat** | `string` |  |
| **DesiredDateFormat** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetTimeNow

```js
const result = await sonos.generatedServices.AlarmClockService.SetTimeNow({ DesiredTime:..., TimeZoneForDesiredTime:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredTime** | `string` |  |
| **TimeZoneForDesiredTime** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetTimeServer

```js
const result = await sonos.generatedServices.AlarmClockService.SetTimeServer({ DesiredTimeServer:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredTimeServer** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetTimeZone

```js
const result = await sonos.generatedServices.AlarmClockService.SetTimeZone({ Index:..., AutoAdjustDst:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Index** | `number` |  |
| **AutoAdjustDst** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### UpdateAlarm

Update an alarm, all parameters are required.

```js
const result = await sonos.generatedServices.AlarmClockService.UpdateAlarm({ ID:..., StartLocalTime:..., Duration:..., Recurrence:..., Enabled:..., RoomUUID:..., ProgramURI:..., ProgramMetaData:..., PlayMode:..., Volume:..., IncludeLinkedZones:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ID** | `number` | The ID of the alarm see ListAlarms |
| **StartLocalTime** | `string` | The start time as `hh:mm:ss` |
| **Duration** | `string` | The duration as `hh:mm:ss` |
| **Recurrence** | `string` | Repeat this alarm on Allowed values: `ONCE` / `WEEKDAYS` / `WEEKENDS` / `DAILY` |
| **Enabled** | `boolean` | Alarm enabled after creation |
| **RoomUUID** | `string` | The UUID of the speaker you want this alarm for |
| **ProgramURI** | `string` | The sound uri |
| **ProgramMetaData** | `string` | The sound metadata, can be empty string |
| **PlayMode** | `string` | Alarm play mode Allowed values: `NORMAL` / `REPEAT_ALL` / `SHUFFLE_NOREPEAT` / `SHUFFLE` |
| **Volume** | `number` | Volume between 0 and 100 |
| **IncludeLinkedZones** | `boolean` | Should grouped players also play the alarm? |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Some libraries support PatchAlarm where you can update a single parameter

