---
layout: default
title: ZoneGroupTopology
---
# ZoneGroupTopology service

Zone config stuff, eg getting all the configured sonos zones

The ZoneGroupTopology service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.ZoneGroupTopologyService().OneOfTheMethodsBelow({...})
```

## Actions

### BeginSoftwareUpdate

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService().BeginSoftwareUpdate({ UpdateURL:..., Flags:..., ExtraOptions:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **UpdateURL** | `string` |  |
| **Flags** | `number` |  |
| **ExtraOptions** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### CheckForUpdate

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService().CheckForUpdate({ UpdateType:..., CachedOnly:..., Version:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **UpdateType** | `string` |  Allowed values: `All` / `Software` |
| **CachedOnly** | `boolean` |  |
| **Version** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **UpdateItem** | `string` |  |

### GetZoneGroupAttributes

Get information about the current Zone

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService.GetZoneGroupAttributes();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentZoneGroupName** | `string` |  |
| **CurrentZoneGroupID** | `string` |  |
| **CurrentZonePlayerUUIDsInGroup** | `string` |  |
| **CurrentMuseHouseholdId** | `string` |  |

### GetZoneGroupState

Get all the Sonos groups, (as XML)

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService.GetZoneGroupState();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **ZoneGroupState** | `string` | xml string, see remarks |

**Remarks** Some libraries also support GetParsedZoneGroupState that parses the xml for you.

### RegisterMobileDevice

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService().RegisterMobileDevice({ MobileDeviceName:..., MobileDeviceUDN:..., MobileIPAndPort:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **MobileDeviceName** | `string` |  |
| **MobileDeviceUDN** | `string` |  |
| **MobileIPAndPort** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### ReportAlarmStartedRunning

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService.ReportAlarmStartedRunning();
```

This actions returns a boolean whether or not the requests succeeded.

### ReportUnresponsiveDevice

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService().ReportUnresponsiveDevice({ DeviceUUID:..., DesiredAction:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DeviceUUID** | `string` |  |
| **DesiredAction** | `string` |  Allowed values: `Remove` / `TopologyMonitorProbe` / `VerifyThenRemoveSystemwide` |

This actions returns a boolean whether or not the requests succeeded.

### SubmitDiagnostics

```js
const result = await sonos.generatedServices.ZoneGroupTopologyService().SubmitDiagnostics({ IncludeControllers:..., Type:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **IncludeControllers** | `boolean` |  |
| **Type** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **DiagnosticID** | `number` |  |

