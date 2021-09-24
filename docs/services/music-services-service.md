---
layout: default
title: MusicServices
---
# MusicServices service

Access to external music services, like Spotify or Youtube Music

The MusicServices service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.MusicServicesService().OneOfTheMethodsBelow({...})
```

## Actions

### GetSessionId

```js
const result = await sonos.generatedServices.MusicServicesService.GetSessionId({ ServiceId:..., Username:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ServiceId** | `number` |  |
| **Username** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SessionId** | `string` |  |

### ListAvailableServices

Load music service list as xml

```js
const result = await sonos.generatedServices.MusicServicesService.ListAvailableServices();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AvailableServiceDescriptorList** | `string` |  |
| **AvailableServiceTypeList** | `string` |  |
| **AvailableServiceListVersion** | `string` |  |

**Remarks** Some libraries also support ListAndParseAvailableServices

### UpdateAvailableServices

```js
const result = await sonos.generatedServices.MusicServicesService.UpdateAvailableServices();
```

This actions returns a boolean whether or not the requests succeeded.

