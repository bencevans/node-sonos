# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'./Service'

* * *

## Class: AVTransport

Create a new instance of AVTransport

### sonos.AVTransport.ReorderTracksInQueue(options)

Reorder tracks in queue

**Parameters**:

**options**: `object`, All the required options

+ **options.InstanceID**: `number`, The instance you want to edit is always `0`

+ **options.UpdateID**: `number`, The update id, not a qlue what this means. Just specify `0`

+ **options.StartingIndex**: `number`, The index of the first song you want to move.

+ **options.NumberOfTracks**: `number`, How many tracks do you want to move?

+ **options.InsertBefore**: `number`, Where should these tracks be inserted?

### sonos.AVTransport.SnoozeAlarm(options)

Snooze the current running alarm for a number of minutes.

**Parameters**:

**options**: `object`, An object with the required properties

+ **options.InstanceID**: `number`, The instance you want to control, is always `0`

+ **options.Duration**: `string`, The duration, as 'ISO8601Time', needs sample!

* * *
