---
layout: default
title: Queue
---
# Queue service

Modify and browse queues

The Queue service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.QueueService().OneOfTheMethodsBelow({...})
```

## Actions

### AddMultipleURIs

```js
const result = await sonos.generatedServices.QueueService().AddMultipleURIs({ QueueID:..., UpdateID:..., ContainerURI:..., ContainerMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:..., NumberOfURIs:..., EnqueuedURIsAndMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AddURI

```js
const result = await sonos.generatedServices.QueueService().AddURI({ QueueID:..., UpdateID:..., EnqueuedURI:..., EnqueuedURIMetaData:..., DesiredFirstTrackNumberEnqueued:..., EnqueueAsNext:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **EnqueuedURI** | `string` |  |
| **EnqueuedURIMetaData** | `string` |  |
| **DesiredFirstTrackNumberEnqueued** | `number` |  |
| **EnqueueAsNext** | `boolean` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **FirstTrackNumberEnqueued** | `number` |  |
| **NumTracksAdded** | `number` |  |
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### AttachQueue

```js
const result = await sonos.generatedServices.QueueService().AttachQueue({ QueueOwnerID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **QueueOwnerContext** | `string` |  |

### Backup

```js
const result = await sonos.generatedServices.QueueService.Backup();
```

This actions returns a boolean whether or not the requests succeeded.

### Browse

```js
const result = await sonos.generatedServices.QueueService().Browse({ QueueID:..., StartingIndex:..., RequestedCount:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **RequestedCount** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Result** | `string` |  |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

### CreateQueue

```js
const result = await sonos.generatedServices.QueueService().CreateQueue({ QueueOwnerID:..., QueueOwnerContext:..., QueuePolicy:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueOwnerID** | `string` |  |
| **QueueOwnerContext** | `string` |  |
| **QueuePolicy** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |

### RemoveAllTracks

```js
const result = await sonos.generatedServices.QueueService().RemoveAllTracks({ QueueID:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### RemoveTrackRange

```js
const result = await sonos.generatedServices.QueueService().RemoveTrackRange({ QueueID:..., UpdateID:..., StartingIndex:..., NumberOfTracks:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReorderTracks

```js
const result = await sonos.generatedServices.QueueService().ReorderTracks({ QueueID:..., StartingIndex:..., NumberOfTracks:..., InsertBefore:..., UpdateID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **StartingIndex** | `number` |  |
| **NumberOfTracks** | `number` |  |
| **InsertBefore** | `number` |  |
| **UpdateID** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewUpdateID** | `number` |  |

### ReplaceAllTracks

```js
const result = await sonos.generatedServices.QueueService().ReplaceAllTracks({ QueueID:..., UpdateID:..., ContainerURI:..., ContainerMetaData:..., CurrentTrackIndex:..., NewCurrentTrackIndices:..., NumberOfURIs:..., EnqueuedURIsAndMetaData:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **UpdateID** | `number` |  |
| **ContainerURI** | `string` |  |
| **ContainerMetaData** | `string` |  |
| **CurrentTrackIndex** | `number` |  |
| **NewCurrentTrackIndices** | `string` |  |
| **NumberOfURIs** | `number` |  |
| **EnqueuedURIsAndMetaData** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewQueueLength** | `number` |  |
| **NewUpdateID** | `number` |  |

### SaveAsSonosPlaylist

```js
const result = await sonos.generatedServices.QueueService().SaveAsSonosPlaylist({ QueueID:..., Title:..., ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **QueueID** | `number` |  |
| **Title** | `string` |  |
| **ObjectID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AssignedObjectID** | `string` |  |

