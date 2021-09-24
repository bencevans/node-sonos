---
layout: default
title: HTControl
---
# HTControl service

Service related to the TV remote control

The HTControl service is available on these models: `v1-S9` / `v2-S14`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.HTControlService().OneOfTheMethodsBelow({...})
```

## Actions

### CommitLearnedIRCodes

```js
const result = await sonos.generatedServices.HTControlService.CommitLearnedIRCodes({ Name:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Name** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### GetIRRepeaterState

```js
const result = await sonos.generatedServices.HTControlService.GetIRRepeaterState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentIRRepeaterState** | `string` |  Possible values: `On` / `Off` / `Disabled` |

### GetLEDFeedbackState

```js
const result = await sonos.generatedServices.HTControlService.GetLEDFeedbackState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **LEDFeedbackState** | `string` |  Possible values: `On` / `Off` |

### IdentifyIRRemote

```js
const result = await sonos.generatedServices.HTControlService.IdentifyIRRemote({ Timeout:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Timeout** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### IsRemoteConfigured

```js
const result = await sonos.generatedServices.HTControlService.IsRemoteConfigured();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RemoteConfigured** | `boolean` |  |

### LearnIRCode

```js
const result = await sonos.generatedServices.HTControlService.LearnIRCode({ IRCode:..., Timeout:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **IRCode** | `string` |  |
| **Timeout** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetIRRepeaterState

```js
const result = await sonos.generatedServices.HTControlService.SetIRRepeaterState({ DesiredIRRepeaterState:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredIRRepeaterState** | `string` |  Allowed values: `On` / `Off` / `Disabled` |

This actions returns a boolean whether or not the requests succeeded.

### SetLEDFeedbackState

```js
const result = await sonos.generatedServices.HTControlService.SetLEDFeedbackState({ LEDFeedbackState:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **LEDFeedbackState** | `string` |  Allowed values: `On` / `Off` |

This actions returns a boolean whether or not the requests succeeded.

