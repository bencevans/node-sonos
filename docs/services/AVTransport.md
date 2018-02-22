# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'./Service'

* * *

## Class: AVTransport

Create a new instance of AVTransport

### sonos.AVTransport.SetAVTransportURI(options)

Set the Transport URI

**Parameters**:

**options**: `object`, Object with required options

+ **options.InstanceID**: `number`, The instance you want to control is always `0`

+ **options.CurrentURI**: `string`, The new URI you wish to set.

+ **options.CurrentURIMetaData**: `string`, The metadata of the uri you wish to set.

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.AddURIToQueue(options)

Add an URI to the queue

**Parameters**:

**options**: `object`, The the required properties

+ **options.InstanceID**: `number`, The instance you want to control is always `0`

+ **options.EnqueuedURI**: `number`, The URI of the track you want to add

+ **options.EnqueuedURIMetaData**: `number`, The Metadata of the track you wish to add, see `Helpers.GenerateMetadata`

+ **options.DesiredFirstTrackNumberEnqueued**: `number`, The position in the queue

+ **options.EnqueueAsNext**: `number`, To Queue this item as the next item set to `1`

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.ReorderTracksInQueue(options)

Reorder tracks in queue

**Parameters**:

**options**: `object`, All the required options

+ **options.InstanceID**: `number`, The instance you want to edit is always `0`

+ **options.UpdateID**: `number`, The update id, not a qlue what this means. Just specify `0`

+ **options.StartingIndex**: `number`, The index of the first song you want to move.

+ **options.NumberOfTracks**: `number`, How many tracks do you want to move?

+ **options.InsertBefore**: `number`, Where should these tracks be inserted?

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.SetPlayMode(playmode)

Set the new playmode

**Parameters**:

**playmode**: `string`, One of the following `NORMAL` `REPEAT_ALL` `SHUFFLE` `SHUFFLE_NOREPEAT`

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.ConfigureSleepTimer(duration)

Configure a sleeptimer.

**Parameters**:

**duration**: `string`, the duration as 'ISO8601Time', needs sample!

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.SnoozeAlarm(duration)

Snooze the current running alarm for a number of minutes.

**Parameters**:

**duration**: `string`, The duration, as 'ISO8601Time', needs sample!

**Returns**: `Object`, Parsed response data.

### sonos.AVTransport.CurrentTrack()

Get information about the current track, parsed version of `GetPositionInfo()`

**Returns**: `Object`, The current playing track

* * *
