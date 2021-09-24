---
layout: default
title: GroupManagement
---
# GroupManagement service

Services related to groups

The GroupManagement service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.GroupManagementService().OneOfTheMethodsBelow({...})
```

## Actions

### AddMember

```js
const result = await sonos.generatedServices.GroupManagementService().AddMember({ MemberID:..., BootSeq:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **MemberID** | `string` |  |
| **BootSeq** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **CurrentTransportSettings** | `string` |  |
| **CurrentURI** | `string` |  |
| **GroupUUIDJoined** | `string` |  |
| **ResetVolumeAfter** | `boolean` |  |
| **VolumeAVTransportURI** | `string` |  |

### RemoveMember

```js
const result = await sonos.generatedServices.GroupManagementService().RemoveMember({ MemberID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **MemberID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### ReportTrackBufferingResult

```js
const result = await sonos.generatedServices.GroupManagementService().ReportTrackBufferingResult({ MemberID:..., ResultCode:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **MemberID** | `string` |  |
| **ResultCode** | `number` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetSourceAreaIds

```js
const result = await sonos.generatedServices.GroupManagementService().SetSourceAreaIds({ DesiredSourceAreaIds:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **DesiredSourceAreaIds** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

