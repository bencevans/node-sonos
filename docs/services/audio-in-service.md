---
layout: default
title: AudioIn
---
# AudioIn service

Control line in

The AudioIn service is available on these models: `v1-S5` / `v2-S6`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.AudioInService().OneOfTheMethodsBelow({...})
```

## Actions

### GetAudioInputAttributes

```js
const result = await sonos.generatedServices.AudioInService.GetAudioInputAttributes();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentName** | `string` |  |
| **CurrentIcon** | `string` |  |

### GetLineInLevel

```js
const result = await sonos.generatedServices.AudioInService.GetLineInLevel();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentLeftLineInLevel** | `number` |  |
| **CurrentRightLineInLevel** | `number` |  |

### SelectAudio

```js
const result = await sonos.generatedServices.AudioInService.SelectAudio({ ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetAudioInputAttributes

```js
const result = await sonos.generatedServices.AudioInService.SetAudioInputAttributes({ DesiredName:..., DesiredIcon:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredName** | `string` |  |
| **DesiredIcon** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetLineInLevel

```js
const result = await sonos.generatedServices.AudioInService.SetLineInLevel({ DesiredLeftLineInLevel:..., DesiredRightLineInLevel:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredLeftLineInLevel** | `number` |  |
| **DesiredRightLineInLevel** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### StartTransmissionToGroup

```js
const result = await sonos.generatedServices.AudioInService.StartTransmissionToGroup({ CoordinatorID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **CoordinatorID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTransportSettings** | `string` |  |

### StopTransmissionToGroup

```js
const result = await sonos.generatedServices.AudioInService.StopTransmissionToGroup({ CoordinatorID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **CoordinatorID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

