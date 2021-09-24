---
layout: default
title: ConnectionManager
---
# ConnectionManager service

Services related to connections and protocols

The ConnectionManager service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.ConnectionManagerService().OneOfTheMethodsBelow({...})
```

## Actions

### GetCurrentConnectionIDs

```js
const result = await sonos.generatedServices.ConnectionManagerService.GetCurrentConnectionIDs();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **ConnectionIDs** | `string` |  |

### GetCurrentConnectionInfo

```js
const result = await sonos.generatedServices.ConnectionManagerService().GetCurrentConnectionInfo({ ConnectionID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ConnectionID** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RcsID** | `number` |  |
| **AVTransportID** | `number` |  |
| **ProtocolInfo** | `string` |  |
| **PeerConnectionManager** | `string` |  |
| **PeerConnectionID** | `number` |  |
| **Direction** | `string` |  Possible values: `Input` / `Output` |
| **Status** | `string` |  Possible values: `OK` / `ContentFormatMismatch` / `InsufficientBandwidth` / `UnreliableChannel` / `Unknown` |

### GetProtocolInfo

```js
const result = await sonos.generatedServices.ConnectionManagerService.GetProtocolInfo();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Source** | `string` |  |
| **Sink** | `string` |  |

