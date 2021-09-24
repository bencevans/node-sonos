---
layout: default
title: DeviceProperties
---
# DeviceProperties service

Modify device properties, like LED status and stereo pairs

The DeviceProperties service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.DevicePropertiesService().OneOfTheMethodsBelow({...})
```

## Actions

### AddBondedZones

```js
const result = await sonos.generatedServices.DevicePropertiesService().AddBondedZones({ ChannelMapSet:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### AddHTSatellite

```js
const result = await sonos.generatedServices.DevicePropertiesService().AddHTSatellite({ HTSatChanMapSet:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **HTSatChanMapSet** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### CreateStereoPair

Create a stereo pair (left, right speakers), right one becomes hidden

```js
const result = await sonos.generatedServices.DevicePropertiesService().CreateStereoPair({ ChannelMapSet:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` | example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** No all speakers support StereoPairs

### EnterConfigMode

```js
const result = await sonos.generatedServices.DevicePropertiesService().EnterConfigMode({ Mode:..., Options:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Mode** | `string` |  |
| **Options** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **State** | `string` |  |

### ExitConfigMode

```js
const result = await sonos.generatedServices.DevicePropertiesService().ExitConfigMode({ Options:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Options** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### GetAutoplayLinkedZones

```js
const result = await sonos.generatedServices.DevicePropertiesService().GetAutoplayLinkedZones({ Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IncludeLinkedZones** | `boolean` |  |

### GetAutoplayRoomUUID

```js
const result = await sonos.generatedServices.DevicePropertiesService().GetAutoplayRoomUUID({ Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RoomUUID** | `string` |  |

### GetAutoplayVolume

```js
const result = await sonos.generatedServices.DevicePropertiesService().GetAutoplayVolume({ Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

### GetButtonLockState

Get the current button lock state

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetButtonLockState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentButtonLockState** | `string` |  Possible values: `On` / `Off` |

### GetButtonState

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetButtonState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **State** | `string` |  |

### GetHouseholdID

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetHouseholdID();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentHouseholdID** | `string` |  |

### GetLEDState

Get the current LED state

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetLEDState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentLEDState** | `string` |  Possible values: `On` / `Off` |

### GetUseAutoplayVolume

```js
const result = await sonos.generatedServices.DevicePropertiesService().GetUseAutoplayVolume({ Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **UseVolume** | `boolean` |  |

### GetZoneAttributes

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetZoneAttributes();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentZoneName** | `string` |  |
| **CurrentIcon** | `string` |  |
| **CurrentConfiguration** | `string` |  |

### GetZoneInfo

Get information about this specific speaker

```js
const result = await sonos.generatedServices.DevicePropertiesService.GetZoneInfo();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SerialNumber** | `string` |  |
| **SoftwareVersion** | `string` |  |
| **DisplaySoftwareVersion** | `string` |  |
| **HardwareVersion** | `string` |  |
| **IPAddress** | `string` |  |
| **MACAddress** | `string` |  |
| **CopyrightInfo** | `string` |  |
| **ExtraInfo** | `string` |  |
| **HTAudioIn** | `number` | SPDIF input, `0` not connected / `2` stereo / `7` Dolby 2.0 / `18` dolby 5.1 / `21` not listening / `22` silence |
| **Flags** | `number` |  |

### RemoveBondedZones

```js
const result = await sonos.generatedServices.DevicePropertiesService().RemoveBondedZones({ ChannelMapSet:..., KeepGrouped:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` |  |
| **KeepGrouped** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### RemoveHTSatellite

```js
const result = await sonos.generatedServices.DevicePropertiesService().RemoveHTSatellite({ SatRoomUUID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **SatRoomUUID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### RoomDetectionStartChirping

```js
const result = await sonos.generatedServices.DevicePropertiesService().RoomDetectionStartChirping({ Channel:..., DurationMilliseconds:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Channel** | `number` |  |
| **DurationMilliseconds** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **PlayId** | `number` |  |
| **ChirpIfPlayingSwappableAudio** | `boolean` |  |

### RoomDetectionStopChirping

```js
const result = await sonos.generatedServices.DevicePropertiesService().RoomDetectionStopChirping({ PlayId:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **PlayId** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SeparateStereoPair

Separate a stereo pair

```js
const result = await sonos.generatedServices.DevicePropertiesService().SeparateStereoPair({ ChannelMapSet:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ChannelMapSet** | `string` | example: `RINCON_B8E9375831C001400:LF,LF;RINCON_000E58FE3AEA01400:RF,RF` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** No all speakers support StereoPairs

### SetAutoplayLinkedZones

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetAutoplayLinkedZones({ IncludeLinkedZones:..., Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **IncludeLinkedZones** | `boolean` |  |
| **Source** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetAutoplayRoomUUID

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetAutoplayRoomUUID({ RoomUUID:..., Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **RoomUUID** | `string` |  |
| **Source** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetAutoplayVolume

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetAutoplayVolume({ Volume:..., Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Volume** | `number` |  |
| **Source** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetButtonLockState

Set the button lock state

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetButtonLockState({ DesiredButtonLockState:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredButtonLockState** | `string` |  Allowed values: `On` / `Off` |

This actions returns a boolean whether or not the requests succeeded.

### SetLEDState

Set the LED state

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetLEDState({ DesiredLEDState:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredLEDState** | `string` |  Allowed values: `On` / `Off` |

This actions returns a boolean whether or not the requests succeeded.

### SetUseAutoplayVolume

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetUseAutoplayVolume({ UseVolume:..., Source:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **UseVolume** | `boolean` |  |
| **Source** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetZoneAttributes

```js
const result = await sonos.generatedServices.DevicePropertiesService().SetZoneAttributes({ DesiredZoneName:..., DesiredIcon:..., DesiredConfiguration:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredZoneName** | `string` |  |
| **DesiredIcon** | `string` |  |
| **DesiredConfiguration** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

