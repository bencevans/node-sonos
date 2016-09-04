Sonos
-----

This module exports 3 items:

    var sonos = require('sonos');

    // sonos.search - searches for Sonos devices on network

    sonos.search(function(device) {
      // device is an instance of sonos.Sonos
      device.currentTrack(console.log);
    });

    // var s = new sonos.Sonos(host, [port]);
    var s = new sonos.Sonos('192.168.2.17')
    s.currentTrack(console.log);

    // sonos.Services - wrappers arounds all UPNP services provided by sonsos
    // These aren't used internally by the module at all but may be useful
    // for more complex projects.

###var Sonos = new sonos.Sonos(host, port)###

Sonos "Class"
####Parameters####

* host *String* IP/DNS
* port *Number* undefined

* * *


###Sonos.prototype.request = function(endpoint, action, body, responseTag, callback)###

UPnP HTTP Request
####Parameters####

* endpoint *String* HTTP Path
* action *String* UPnP Call/Function/Action
* body *String* undefined
* responseTag *String* Expected Response Container XML Tag
* callback *Function* (err, data)

####Returns####

*Void* undefined
* * *

###Sonos.prototype.getMusicLibrary = function(search, options, callback)

Get Music Library
####Parameters

* search *String* artists, albumArtists, albums, genres, composers, tracks, playlists, sonos_playlists, or share
* options *Object* Default {start:0, total:100}
* callback *Function* (err, data) data - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

####Returns####

*Void* undefined
* * *

###Sonos.prototype.currentTrack = function(callback)###

Get Current Track
####Parameters####

* callback *Function* (err, track)

####Returns####

*Void* undefined
* * *

###Sonos.prototype.getCurrentState = function(callback)###

Get current playback state
####Parameters####

* callback *Function* (err, state)

####Returns####

*Void* undefined
* * *


###Sonos.prototype.parseDIDL = function(didl)###

Parse DIDL into track structure
####Parameters####

* didl *String* undefined

####Returns####

*object* undefined
* * *



###Sonos.prototype.getVolume = function(callback)###

Get Current Volume
####Parameters####

* callback *Function* (err, volume)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.getMuted = function(callback)###

Get Current Muted
####Parameters####

* callback *Function* (err, muted)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.play = function(uri, callback)###

Resumes Queue or Plays Provided URI
####Parameters####

* uri *String* Optional - URI to a Audio Stream
* callback *Function* (err, playing)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.stop = function(callback)###

Stop What's Playing
####Parameters####

* callback *Function* (err, stopped)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.pause = function(callback)###

Pause Current Queue
####Parameters####

* callback *Function* (err, paused)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.seek = function(seconds, callback)###

Seek the current track
####Parameters####

* callback *Function* (err, seeked)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.next = function(callback)###

Play next in queue
####Parameters####

* callback *Function* (err, movedToNext)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.previous = function(callback)###

Play previous in queue
####Parameters####

* callback *Function* (err, movedToPrevious)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.queueNext = function(uri, callback)###

Queue a Song Next
####Parameters####

* uri *String* URI to Audio Stream
* callback *Function* (err, queued)

####Returns####

*[type]* undefined
* * *



###Sonos.prototype.queue = function(uri, positionInQueue, callback)###

Add a song to the queue
####Parameters####

* uri *String* URI to Audio Stream
* positionInQueue *Number* Position in queue at which to add song (optional, indexed from 1,
defaults to end of queue, 0 to explicitly set end of queue)
* callback *Function* (err, queued)

####Returns####

*[type]* undefined
* * *

###Sonos.prototype.getQueue = function(callback)###

Get elements in queue
####Parameters####

* callback *Function* (err, data)

####Returns####

*[type]* undefined
* * *


###Sonos.prototype.flush = function(callback)###

Flush queue
####Parameters####

* callback *Function* (err, flushed)

####Returns####

*Void* undefined
* * *



###Sonos.prototype.getLEDState = function(callback)###

Get the LED State
####Parameters####

* callback *Function* (err, state) state is a string, "On" or "Off"

* * *



###Sonos.prototype.setLEDState = function(desiredState, callback)###

Set the LED State
####Parameters####

* desiredState *String* "On"/"Off"
* callback *Function* (err)

* * *



###Sonos.prototype.getZoneInfo = function(callback)###

Get Zone Info
####Parameters####

* callback *Function* (err, info)

* * *



###Sonos.prototype.getZoneAttrs = function(callback)###

Get Zone Attributes
####Parameters####

* callback *Function* (err, data)

* * *



###Sonos.prototype.getTopology = function(callback)###

Get Zones in contact with current Zone with Group Data
####Parameters####

* callback *Function* (err, topology)

* * *



###Sonos.prototype.deviceDescription = function(callback)###

Get Information provided by /xml/device_description.xml
####Parameters####

* callback *Function* (err, info)

* * *



###Sonos.prototype.setName = function(name, callback)###

Set Name
####Parameters####

* name *String* undefined
* callback *Function* (err, data)

####Returns####

*[type]* undefined

* * *



###Sonos.prototype.setPlayMode = function(playmode, callback)###

Set Play Mode
####Parameters####

* undefined *String* undefined
* callback *Function* (err, data)

####Returns####

*[type]* undefined
* * *



###Sonos.prototype.setVolume = function(volume, callback)###

Set Volume
####Parameters####

* volume *String* 0..100
* callback *Function* (err, data)

####Returns####

*[type]* undefined
* * *



###Sonos.prototype.setMuted = function(muted, callback)###

Set Muted
####Parameters####

* muted *Boolean* undefined
* callback *Function* (err, data)

####Returns####

*[type]* undefined
* * *



###Sonos.prototype.getFavoritesRadioStations = function(options, callback)

Get Favorites Radio Stations
####Parameters

* options *Object* Default {start:0, total:100}
* callback *Function* (err, data) data - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

####Returns####

*Void* undefined
* * *



###Sonos.prototype.getFavoritesRadioShows = function(options, callback)

Get Favorites Radio Shows
####Parameters

* options *Object* Default {start:0, total:100}
* callback *Function* (err, data) data - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

####Returns####

*Void* undefined
* * *



###Sonos.prototype.getFavoritesRadio = function(favoriteRadioType, options, callback)

Get Favorites Radio for a given type
####Parameters

* favoriteRadioType *String* stations, shows
* options *Object* Default {start:0, total:100}
* callback *Function* (err, data) data - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}

####Returns####

*Void* undefined
* * *



Search
------

###var Search = function Search([options])###

Search "Class"
Emits 'DeviceAvailable' on a Sonos Component Discovery
Listens on a random UDP port, or the specified port in options

####Parameters####

* Optional *Object* with options - {port: {Number}}
* * *


search
------

###var search = sonos.search([options], [listener])###

Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)
Listens on a random UDP port, or the specified port in options

####Parameters####

* Optional *Object* with options - {port: {Number}}
* Optional *Function* 'DeviceAvailable' listener (sonos)

####Returns####

{Search/EventEmitter Instance}
* * *


###Search.prototype.destroy = function(callback)###

Stops searching and destroy the Search object
####Parameters####

* callback *Function* ()

####Returns####

*[type]* undefined
* * *
