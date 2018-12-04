# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'./Service'
+ module:'events'
+ module:'request-promise-native'
+ module:'debug'
+ module:'./events/listener'

* * *

## Class: Sonos

Create an instance of Sonos

**Sonos**:  , Export
### sonos.Sonos.getMusicLibrary(searchType, options)

Get Music Library Information

**Parameters**:

**searchType**: `String`, Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share

**options**: `Object`, Optional - default {start: 0, total: 100}

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.searchMusicLibrary(searchType, searchTerm, requestOptions, separator)

Get Music Library Information

**Parameters**:

**searchType**: `String`, Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share

**searchTerm**: `String`, Optional - search term to search for

**requestOptions**: `Object`, Optional - default {start: 0, total: 100}

**separator**: `String`, Optional - default is colon. `:` or `/`

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.getFavorites()

Get Sonos Favorites

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.currentTrack()

Get Current Track

**Returns**: `Object`, All the info of the current track

### sonos.Sonos.getVolume()

Get Current Volume

**Returns**: `Number`, The current volume

### sonos.Sonos.getMuted()

Get Current Muted

**Returns**: `Boolean`

### sonos.Sonos.play(options)

Resumes Queue or Plays Provided URI

**Parameters**:

**options**: `String | Object`, Optional - URI to a Audio Stream or Object with play options

**Returns**: `Boolean`, Started playing?

### sonos.Sonos.setAVTransportURI(options)

Plays a uri directly (the queue stays the same)

**Parameters**:

**options**: `String | Object`, URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`

**Returns**: `Boolean`

### sonos.Sonos.stop()

Stop What's Playing

**Returns**: `boolean`

### sonos.Sonos.getAllGroups()

Get all the groups, replaces some functionality of 'getTopology()'


### sonos.Sonos.becomeCoordinatorOfStandaloneGroup()

Become Coordinator of Standalone Group

**Returns**: `boolean`

### sonos.Sonos.leaveGroup()

Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)

**Returns**: `boolean`

### sonos.Sonos.joinGroup(otherDeviceName)

Join an other device by name

**Parameters**:

**otherDeviceName**: `String`, The name of de device you want to join, doesn't matter if that isn't the coordinator

**Returns**: `Boolean`

### sonos.Sonos.pause()

Pause Current Queue

**Returns**: `Boolean`

### sonos.Sonos.seek(seconds)

Seek in the current track

**Parameters**:

**seconds**: `Number`, jump to x seconds.

**Returns**: `Boolean`

### sonos.Sonos.selectTrack(trackNr)

Select specific track in queue

**Parameters**:

**trackNr**: `Number`, Number of track in queue (optional, indexed from 1)

**Returns**: `Boolean`

### sonos.Sonos.next()

Play next in queue

**Returns**: `Boolean`

### sonos.Sonos.previous()

Play previous in queue

**Returns**: `Boolean`

### sonos.Sonos.selectQueue()

Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.

**Returns**: `Boolean`, success

### sonos.Sonos.playTuneinRadio(stationId)

Plays tunein based on radio station id

**Parameters**:

**stationId**: `String`, tunein radio station id

**Returns**: `Boolean`

### sonos.Sonos.playSpotifyRadio(artistId)

Plays Spotify radio based on artist uri

**Parameters**:

**artistId**: `String`, Spotify artist id

**Returns**: `Boolean`

### sonos.Sonos.queue(options, positionInQueue)

Add a song to the queue.

**Parameters**:

**options**: `String | Object`, Uri with audio stream of object with `uri` and `metadata`

**positionInQueue**: `Number`, Position in queue at which to add song (optional, indexed from 1,
                                   defaults to end of queue, 0 to explicitly set end of queue)

**Returns**: `Object`, Some info about the last queued file.

### sonos.Sonos.removeTracksFromQueue(startIndex, numberOfTracks)

Remove a range of tracks from the queue.

**Parameters**:

**startIndex**: `number`, Where to start removing the tracks, 1 for first item!

**numberOfTracks**: `number`, How many tracks to remove.


### sonos.Sonos.flush()

Flush queue

**Returns**: `Object`

### sonos.Sonos.getLEDState()

Get the LED State

**Returns**: `String`, state is a string, "On" or "Off"

### sonos.Sonos.setLEDState(newState)

Set the LED State

**Parameters**:

**newState**: `String`, "On"/"Off"

**Returns**: `Boolean`

### sonos.Sonos.getZoneInfo()

Get Zone Info

**Returns**: `Object`

### sonos.Sonos.getZoneAttrs()

Get Zone Attributes

**Returns**: `Object`

### sonos.Sonos.deviceDescription()

Get Information provided by /xml/device_description.xml

**Returns**: `Object`

### sonos.Sonos.setName(name)

Set Name

**Parameters**:

**name**: `String`, Set Name

**Returns**: `Object`

### sonos.Sonos.getName()

Get the CurrentZoneName

**Returns**: `String`

### sonos.Sonos.getPlayMode()

Get Play Mode

**Returns**: `String`

### sonos.Sonos.setPlayMode(playmode)

Set Play Mode

**Parameters**:

**playmode**: `String`, Set Play Mode

**Returns**: `Object`

### sonos.Sonos.setVolume(volume, channel)

Set Volume

**Parameters**:

**volume**: `number`, 0..100

**channel**: `string`, What channel to change, `Master` is default.

**Returns**: `Object`

### sonos.Sonos.configureSleepTimer(sleepTimerDuration)

Configure Sleep Timer

**Parameters**:

**sleepTimerDuration**: `String`, Configure Sleep Timer

**Returns**: `Object`

### sonos.Sonos.setMuted(muted, channel)

Set Muted

**Parameters**:

**muted**: `Boolean`, Set Muted

**channel**: `string`, What channel to change, `Master` is default.

**Returns**: `Object`

### sonos.Sonos.getTopology()

Get Zones in contact with current Zone with Group Data

Deprecated: Doesn't work if you upgraded your system to Sonos v9.1

**Returns**: `Object`

### sonos.Sonos.getCurrentState()

Get Current Playback State

**Returns**: `String`, the current playback state

### sonos.Sonos.togglePlayback()

Toggle the current playback, like the button. Currently only works for state `playing` or `paused`

**Returns**: `Boolean`

### sonos.Sonos.getFavoritesRadioStations(options)

Get Favorites Radio Stations

**Parameters**:

**options**: `Object`, Optional - default {start: 0, total: 100}

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.getFavoritesRadioShows(options)

Get Favorites Radio Shows

**Parameters**:

**options**: `Object`, Optional - default {start: 0, total: 100}

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.getFavoritesRadio(favoriteRadioType, options)

Get Favorites Radio for a given radio type

**Parameters**:

**favoriteRadioType**: `String`, Choice - stations, shows

**options**: `Object`, Optional - default {start: 0, total: 100}

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.getQueue()

Get the current queue

**Returns**: `Object`, {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

### sonos.Sonos.playNotification(options)

Play uri and restore last state

**Parameters**:

**options**: `String | Object`, URI to a Audio Stream or Object with play options see `Helpers.GenerateMetadata`

+ **options.uri**: `String`, The URI of the stream

+ **options.metadata**: `String`, The metadata of the stream see `Helpers.GenerateMetadata`

+ **options.onlyWhenPlaying**: `Boolean`, Only play this notification on players currently 'playing'

+ **options.volume**: `Number`, The volume used for the notification.

**Returns**: `Boolean`, Did the notification play? Only returns when finished reverting to old play settings.

### sonos.Sonos.reorderTracksInQueue(startingIndex, numberOfTracks, insertBefore, updateId)

Reorder tracks in queue.

**Parameters**:

**startingIndex**: `number`, Index of the first track to be moved

**numberOfTracks**: `number`, How many tracks do we want to move

**insertBefore**: `number`, Index of place where the tracks should be moved to

**updateId**: `number`, Not sure what this means, just leave it at `0`

**Returns**: `Boolean`

### sonos.Sonos.getSpotifyConnectInfo()

Get SpotifyConnect info, will error when no premium account is present

**Returns**: `Object`

* * *
