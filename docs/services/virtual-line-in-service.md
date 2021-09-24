---
layout: default
title: VirtualLineIn
---
# VirtualLineIn service

The VirtualLineIn service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.VirtualLineInService().OneOfTheMethodsBelow({...})
```

## Actions

### Next

```js
const result = await sonos.generatedServices.VirtualLineInService().Next({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### Pause

```js
const result = await sonos.generatedServices.VirtualLineInService().Pause({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### Play

```js
const result = await sonos.generatedServices.VirtualLineInService().Play({ InstanceID:..., Speed:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |
| **Speed** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### Previous

```js
const result = await sonos.generatedServices.VirtualLineInService().Previous({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetVolume

```js
const result = await sonos.generatedServices.VirtualLineInService().SetVolume({ InstanceID:..., DesiredVolume:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |
| **DesiredVolume** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### StartTransmission

```js
const result = await sonos.generatedServices.VirtualLineInService().StartTransmission({ InstanceID:..., CoordinatorID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |
| **CoordinatorID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTransportSettings** | `string` |  |

### Stop

```js
const result = await sonos.generatedServices.VirtualLineInService().Stop({ InstanceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### StopTransmission

```js
const result = await sonos.generatedServices.VirtualLineInService().StopTransmission({ InstanceID:..., CoordinatorID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **InstanceID** | `number` |  |
| **CoordinatorID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

