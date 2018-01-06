# node-sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'./Service'
+ module:'events'
+ module:'dgram'
+ module:'request'
+ module:'xml2js'
+ module:'debug'
+ module:'underscore'
+ module:'safe-buffer'
+ module:'./events/listener'

* * *

## Class: Sonos

Create an instance of Sonos

### node-sonos.Sonos.request(endpoint, action, body, responseTag, callback)

UPnP HTTP Request

**Parameters**:

**endpoint**: `String`, HTTP Path

**action**: `String`, UPnP Call/Function/Action

**body**: `String`, The XML body to be send, will be put in an soap envelope

**responseTag**: `String`, Expected Response Container XML Tag

**callback**: `function`, (err, data)


### node-sonos.Sonos.getMusicLibrary(searchType, options, callback)

Get Music Library Information

**Parameters**:

**searchType**: `String`, Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share

**options**: `Object`, Optional - default {start: 0, total: 100}

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.searchMusicLibrary(searchType, searchTerm, options, callback)

Get Music Library Information

**Parameters**:

**searchType**: `String`, Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share

**searchTerm**: `String`, Optional - search term to search for

**options**: `Object`, Optional - default {start: 0, total: 100}

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.getFavorites(callback)

Get Sonos Favorites

**Parameters**:

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.currentTrack(callback)

Get Current Track

**Parameters**:

**callback**: `function`, (err, track)


### node-sonos.Sonos.parseDIDL(didl)

Parse DIDL into track structure

**Parameters**:

**didl**: `String`, Parse DIDL into track structure

**Returns**: `object`

### node-sonos.Sonos.getVolume(callback)

Get Current Volume

**Parameters**:

**callback**: `function`, (err, volume)


### node-sonos.Sonos.getMuted(callback)

Get Current Muted

**Parameters**:

**callback**: `function`, (err, muted)


### node-sonos.Sonos.play(uri, callback)

Resumes Queue or Plays Provided URI

**Parameters**:

**uri**: `String | Object`, Optional - URI to a Audio Stream or Object with play options

**callback**: `function`, (err, playing)


### node-sonos.Sonos.playWithoutQueue(uri, callback)

Plays a uri directly (the queue stays the same)

**Parameters**:

**uri**: `String | Object`, Optional - URI to a Audio Stream or Object with play options

**callback**: `function`, (err, playing)


### node-sonos.Sonos.stop(callback)

Stop What's Playing

**Parameters**:

**callback**: `function`, (err, stopped)


### node-sonos.Sonos.becomeCoordinatorOfStandaloneGroup(callback)

Become Coordinator of Standalone Group

**Parameters**:

**callback**: `function`, (err, stopped)


### node-sonos.Sonos.leaveGroup(callback)

Leave the group (shortcut to becomeCoordinatorOfStandaloneGroup)

**Parameters**:

**callback**: `function`, (err, stopped)


### node-sonos.Sonos.joinGroup(otherDeviceName, callback)

Join an other device by name

**Parameters**:

**otherDeviceName**: `String`, The name of de device you want to join, doesn't matter if that isn't the coordinator

**callback**: `function`, (err, success)


### node-sonos.Sonos.pause(callback)

Pause Current Queue

**Parameters**:

**callback**: `function`, (err, paused)


### node-sonos.Sonos.seek(callback)

Seek the current track

**Parameters**:

**callback**: `function`, (err, seeked)


### node-sonos.Sonos.selectTrack(trackNr, callback)

Select specific track in queue

**Parameters**:

**trackNr**: `Number`, Number of track in queue (optional, indexed from 1)

**callback**: `function`, (err, data)


### node-sonos.Sonos.next(callback)

Play next in queue

**Parameters**:

**callback**: `function`, (err, movedToNext)


### node-sonos.Sonos.previous(callback)

Play previous in queue

**Parameters**:

**callback**: `function`, (err, movedToPrevious)


### node-sonos.Sonos.selectQueue(callback)

Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.

**Parameters**:

**callback**: `function`, (err, data)  Optional


### node-sonos.Sonos.playTuneinRadio(stationId, callback)

Plays tunein based on radio station id

**Parameters**:

**stationId**: `String`, tunein radio station id

**callback**: `function`, (err, playing)


### node-sonos.Sonos.playSpotifyRadio(artistId, callback)

Plays Spotify radio based on artist uri

**Parameters**:

**artistId**: `String`, Spotify artist id

**callback**: `function`, (err, playing)


### node-sonos.Sonos.queueNext(uri, callback)

Queue a Song Next

**Parameters**:

**uri**: `String | Object`, URI to Audio Stream or Object containing options (uri, metadata)

**callback**: `function`, (err, queued)


### node-sonos.Sonos.queue(uri, positionInQueue, callback)

Add a song to the queue.

**Parameters**:

**uri**: `String`, URI to Audio Stream

**positionInQueue**: `Number`, Position in queue at which to add song (optional, indexed from 1,
                                   defaults to end of queue, 0 to explicitly set end of queue)

**callback**: `function`, (err, queued)


### node-sonos.Sonos.flush(callback)

Flush queue

**Parameters**:

**callback**: `function`, (err, flushed)


### node-sonos.Sonos.getLEDState(callback)

Get the LED State

**Parameters**:

**callback**: `function`, (err, state) state is a string, "On" or "Off"


### node-sonos.Sonos.setLEDState(desiredState, callback)

Set the LED State

**Parameters**:

**desiredState**: `String`, "On"/"Off"

**callback**: `function`, (err)


### node-sonos.Sonos.getZoneInfo(callback)

Get Zone Info

**Parameters**:

**callback**: `function`, (err, info)


### node-sonos.Sonos.getZoneAttrs(callback)

Get Zone Attributes

**Parameters**:

**callback**: `function`, (err, data)


### node-sonos.Sonos.deviceDescription(callback)

Get Information provided by /xml/device_description.xml

**Parameters**:

**callback**: `function`, (err, info)


### node-sonos.Sonos.setName(name, callback)

Set Name

**Parameters**:

**name**: `String`, Set Name

**callback**: `function`, (err, data)


### node-sonos.Sonos.getPlayMode(playmode, callback)

Get Play Mode

**Parameters**:

**playmode**: `String`, Get Play Mode

**callback**: `function`, (err, data)


### node-sonos.Sonos.setPlayMode(playmode, callback)

Set Play Mode

**Parameters**:

**playmode**: `String`, Set Play Mode

**callback**: `function`, (err, data)


### node-sonos.Sonos.setVolume(volume, callback)

Set Volume

**Parameters**:

**volume**: `String`, 0..100

**callback**: `function`, (err, data)


### node-sonos.Sonos.configureSleepTimer(sleepTimerDuration, callback)

Configure Sleep Timer

**Parameters**:

**sleepTimerDuration**: `String`, Configure Sleep Timer

**callback**: `function`, (err, data)


### node-sonos.Sonos.setMuted(muted, callback)

Set Muted

**Parameters**:

**muted**: `Boolean`, Set Muted

**callback**: `function`, (err, data)


### node-sonos.Sonos.getTopology(callback)

Get Zones in contact with current Zone with Group Data

**Parameters**:

**callback**: `function`, (err, topology)


### node-sonos.Sonos.getCurrentState(callback)

Get Current Playback State

**Parameters**:

**callback**: `function`, (err, state)


### node-sonos.Sonos.getFavoritesRadioStations(options, callback)

Get Favorites Radio Stations

**Parameters**:

**options**: `Object`, Optional - default {start: 0, total: 100}

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.getFavoritesRadioShows(options, callback)

Get Favorites Radio Shows

**Parameters**:

**options**: `Object`, Optional - default {start: 0, total: 100}

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.getFavoritesRadio(favoriteRadioType, options, callback)

Get Favorites Radio for a given radio type

**Parameters**:

**favoriteRadioType**: `String`, Choice - stations, shows

**options**: `Object`, Optional - default {start: 0, total: 100}

**callback**: `function`, (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}


### node-sonos.Sonos.startListening(options, callback)

Create a socket and start listening for Events from Sonos

**Parameters**:

**options**: `Object`, As defined in https://github.com/bencevans/node-sonos/blob/master/lib/events/listener.js

**callback**: `function`, (err) result - string


## Class: Search

Create a new instance of Search

**Sonos**:  , Export
### node-sonos.Search.destroy(callback)

Destroys Search class, stop searching, clean up

**Parameters**:

**callback**: `function`, ()


### node-sonos.Search.search(options, listener)

Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)

**Parameters**:

**options**: `Object`, Optional Options to control search behavior.
                         Set 'timeout' to how long to search for devices
                         (in milliseconds).

**listener**: `function`, Optional 'DeviceAvailable' listener (sonos)

**Returns**: `Search`

* * *
