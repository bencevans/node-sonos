## sonos.search([deviceAvailableListener])

Returns a new `sonos.Search` object.

The `deviceAvailableListener` is a function which is automatically
added to the `'DeviceAvailable'` event.

## Class: sonos.Search

This is an Object that extends EventEmitter.

### Event: 'DeviceAvailable'

`function (sonos) { }`

Emitted each time there is a response from an initial search.
 `sonos` is an instance of `sonos.Sonos`

## Class: sonos.Sonos(host, [port])

The host is either the IP or DNS name of your Sonos device, unless specified the port will default to 1400.

### sonos.currentTrack(callback)

Receives metadata on the current track playing, including `title`, `artist`, `album` and `albumArtURI`.

Example:

    sonos.currentTrack(function(err, track) {
      if(err) throw err;
      console.log('Artist: ' + track.artist + ', title:' + track.title);
    });
    
### sonos.play([url], [callback])

Start playing a stream from a provided url or resume queue.

### sonos.pause([callback])

Pauses the current track

### sonos.stop([callback])

Stops the queue.

### sonos.next([callback])

Starts playing next track.

### sonos.previous([callback])

Starts playing the previous track.

###sonos.queueNext(url, [callback])

Queue a stream from a url after the current track.
