---
layout: default
title: GroupRenderingControl
---
# GroupRenderingControl service

Volume related controls for groups

The GroupRenderingControl service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.GroupRenderingControlService().OneOfTheMethodsBelow({...})
```

## Actions

### GetGroupMute

Get the group mute state.

```js
const result = await sonos.generatedServices.GroupRenderingControlService.GetGroupMute({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentMute** | `boolean` |  |

**Remarks** Should be send to coordinator only

### GetGroupVolume

Get the group volume.

```js
const result = await sonos.generatedServices.GroupRenderingControlService.GetGroupVolume({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentVolume** | `number` |  |

**Remarks** Should be send to coordinator only

### SetGroupMute

(Un-/)Mute the entire group

```js
const result = await sonos.generatedServices.GroupRenderingControlService.SetGroupMute({ InstanceID:..., DesiredMute:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DesiredMute** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Should be send to coordinator only

### SetGroupVolume

Change group volume. Players volume will be changed proportionally based on last snapshot

```js
const result = await sonos.generatedServices.GroupRenderingControlService.SetGroupVolume({ InstanceID:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **DesiredVolume** | `number` | New volume between 0 and 100 |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Should be send to coordinator only

### SetRelativeGroupVolume

Relatively change group volume - returns final group volume. Players volume will be changed proportionally based on last snapshot

```js
const result = await sonos.generatedServices.GroupRenderingControlService.SetRelativeGroupVolume({ InstanceID:..., Adjustment:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |
| **Adjustment** | `number` | Number between -100 and +100 |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewVolume** | `number` |  |

**Remarks** Should be send to coordinator only

### SnapshotGroupVolume

Creates a new group volume snapshot,  the volume ratio between all players. It is used by SetGroupVolume and SetRelativeGroupVolume

```js
const result = await sonos.generatedServices.GroupRenderingControlService.SnapshotGroupVolume({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` | InstanceID should always be `0` |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Should be send to coordinator only

