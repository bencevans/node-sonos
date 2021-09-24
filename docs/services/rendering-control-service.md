---
layout: default
title: RenderingControl
---
# RenderingControl service

Volume related controls

The RenderingControl service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.RenderingControlService().OneOfTheMethodsBelow({...})
```

## Actions

### GetBass

Get bass level between -10 and 10

```js
const result = await sonos.generatedServices.RenderingControlService.GetBass({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentBass** | `number` |  |

### GetEQ

Get equalizer value

```js
const result = await sonos.generatedServices.RenderingControlService.GetEQ({ InstanceID:..., EQType:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **EQType** | `string` | Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = full, 1 = ambient) |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentValue** | `number` | Booleans return `1` / `0`, rest number as specified |

**Remarks** Not all EQ types are available on every speaker

### GetHeadphoneConnected

```js
const result = await sonos.generatedServices.RenderingControlService.GetHeadphoneConnected({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentHeadphoneConnected** | `boolean` |  |

### GetLoudness

Whether or not Loudness is on

```js
const result = await sonos.generatedServices.RenderingControlService.GetLoudness({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentLoudness** | `boolean` |  |

### GetMute

```js
const result = await sonos.generatedServices.RenderingControlService.GetMute({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

### GetOutputFixed

```js
const result = await sonos.generatedServices.RenderingControlService.GetOutputFixed({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentFixed** | `boolean` |  |

### GetRoomCalibrationStatus

```js
const result = await sonos.generatedServices.RenderingControlService.GetRoomCalibrationStatus({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RoomCalibrationEnabled** | `boolean` |  |
| **RoomCalibrationAvailable** | `boolean` |  |

### GetSupportsOutputFixed

```js
const result = await sonos.generatedServices.RenderingControlService.GetSupportsOutputFixed({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentSupportsFixed** | `boolean` |  |

### GetTreble

Get treble

```js
const result = await sonos.generatedServices.RenderingControlService.GetTreble({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTreble** | `number` | Number between -10 and 10 |

### GetVolume

Get volume

```js
const result = await sonos.generatedServices.RenderingControlService.GetVolume({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` | Number between 0 and 100 |

### GetVolumeDB

```js
const result = await sonos.generatedServices.RenderingControlService.GetVolumeDB({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetVolumeDBRange

```js
const result = await sonos.generatedServices.RenderingControlService.GetVolumeDBRange({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **MinValue** | `number` |  |
| **MaxValue** | `number` |  |

### RampToVolume

```js
const result = await sonos.generatedServices.RenderingControlService.RampToVolume({ InstanceID:..., Channel:..., RampType:..., DesiredVolume:..., ResetVolumeAfter:..., ProgramURI:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **RampType** | `string` |  Allowed values: `SLEEP_TIMER_RAMP_TYPE` / `ALARM_RAMP_TYPE` / `AUTOPLAY_RAMP_TYPE` |
| **DesiredVolume** | `number` |  |
| **ResetVolumeAfter** | `boolean` |  |
| **ProgramURI** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RampTime** | `number` |  |

### ResetBasicEQ

```js
const result = await sonos.generatedServices.RenderingControlService.ResetBasicEQ({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Bass** | `number` |  |
| **Treble** | `number` |  |
| **Loudness** | `boolean` |  |
| **LeftVolume** | `number` |  |
| **RightVolume** | `number` |  |

### ResetExtEQ

```js
const result = await sonos.generatedServices.RenderingControlService.ResetExtEQ({ InstanceID:..., EQType:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **EQType** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### RestoreVolumePriorToRamp

```js
const result = await sonos.generatedServices.RenderingControlService.RestoreVolumePriorToRamp({ InstanceID:..., Channel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |

This actions returns a boolean whether or not the requests succeeded.

### SetBass

Set bass level, between -10 and 10

```js
const result = await sonos.generatedServices.RenderingControlService.SetBass({ InstanceID:..., DesiredBass:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DesiredBass** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetChannelMap

```js
const result = await sonos.generatedServices.RenderingControlService.SetChannelMap({ InstanceID:..., ChannelMap:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **ChannelMap** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetEQ

Set equalizer value for different types

```js
const result = await sonos.generatedServices.RenderingControlService.SetEQ({ InstanceID:..., EQType:..., DesiredValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **EQType** | `string` | Allowed values `DialogLevel` (bool) / `MusicSurroundLevel` (-15/+15) /  `NightMode` (bool) / `SubGain` (-10/+10) / `SurroundEnable` (bool) / `SurroundLevel` (-15/+15) / `SurroundMode` (0 = full, 1 = ambient) |
| **DesiredValue** | `number` | Booleans required `1` for true or `0` for false, rest number as specified |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Not supported by all speakers, TV related

### SetLoudness

Set loudness on / off

```js
const result = await sonos.generatedServices.RenderingControlService.SetLoudness({ InstanceID:..., Channel:..., DesiredLoudness:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredLoudness** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetMute

```js
const result = await sonos.generatedServices.RenderingControlService.SetMute({ InstanceID:..., Channel:..., DesiredMute:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` / `SpeakerOnly` |
| **DesiredMute** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetOutputFixed

```js
const result = await sonos.generatedServices.RenderingControlService.SetOutputFixed({ InstanceID:..., DesiredFixed:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DesiredFixed** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetRelativeVolume

```js
const result = await sonos.generatedServices.RenderingControlService.SetRelativeVolume({ InstanceID:..., Channel:..., Adjustment:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **Adjustment** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

### SetRoomCalibrationStatus

```js
const result = await sonos.generatedServices.RenderingControlService.SetRoomCalibrationStatus({ InstanceID:..., RoomCalibrationEnabled:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **RoomCalibrationEnabled** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetRoomCalibrationX

```js
const result = await sonos.generatedServices.RenderingControlService.SetRoomCalibrationX({ InstanceID:..., CalibrationID:..., Coefficients:..., CalibrationMode:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **CalibrationID** | `string` |  |
| **Coefficients** | `string` |  |
| **CalibrationMode** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetTreble

Set treble level

```js
const result = await sonos.generatedServices.RenderingControlService.SetTreble({ InstanceID:..., DesiredTreble:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DesiredTreble** | `number` | between -10 and 10 |

This actions returns a boolean whether or not the requests succeeded.

### SetVolume

```js
const result = await sonos.generatedServices.RenderingControlService.SetVolume({ InstanceID:..., Channel:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetVolumeDB

```js
const result = await sonos.generatedServices.RenderingControlService.SetVolumeDB({ InstanceID:..., Channel:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Channel** | `string` |  Allowed values: `Master` / `LF` / `RF` |
| **DesiredVolume** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

