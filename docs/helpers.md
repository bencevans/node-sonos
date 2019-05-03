# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'debug'
+ module:'xml2js

* * *

## Class: Helpers

Helper class

### sonos.Helpers.CreateSoapEnvelop(body)

Wrap in UPnP Envelope

**Parameters**:

**body**: `String`, The SOAP body.

**Returns**: `String`

### sonos.Helpers.EncodeXml(input)

Encodes characters not allowed within html/xml tags, for use with nester xml.

**Parameters**:

**input**: `String`, Encodes characters not allowed within html/xml tags, for use with nester xml.

**Returns**: `String`

### sonos.Helpers.GetUpnpClass(parentID)

Converts parentID to upnp cass

**Parameters**:

**parentID**: `String`, The id of the parent

**Returns**: `String`, object.item.audioItem.musicTrack

### sonos.Helpers.GenerateCustomMetadata(streamUri, itemId, duration, title, artist, album, coverUrl, parentId)

Generate custom metadata, to be used with the play and/or setAVTransportURI

**Parameters**:

**streamUri**: `String`, The playback uri

**itemId**: `String`, Generate custom metadata, to be used with the play and/or setAVTransportURI

**duration**: `String`, The duration of the song, as 'hh:mm:ss'

**title**: `String`, The title of the song

**artist**: `String`, The artist of the sons

**album**: `String`, the album of the song

**coverUrl**: `String`, the coverUrl of the song

**parentId**: `String`, the parentId of the song


### sonos.Helpers.GenerateLocalMetadata(uri, artUri)

Creates object with uri and metadata from playback uri

**Parameters**:

**uri**: `String`, The playback uri

**artUri**: `String`, Uri for art image

**Returns**: `Object`, { uri: uri, metadata: metadata }

### sonos.Helpers.GenerateMetadata(uri, title, region)

Creates object with uri and metadata from playback uri

**Parameters**:

**uri**: `String`, The playback uri (currently supports spotify, tunein)

**title**: `String`, Sometimes the title is required.

**region**: `String`, Spotify region is required for all spotify tracks, see `sonos.SpotifyRegion`

**Returns**: `Object`, options       {uri: Spotify uri, metadata: metadata}

### sonos.Helpers.ParseDIDL(didl, host, port)

Parse DIDL into track structure

**Parameters**:

**didl**: `String`, Parse DIDL into track structure

**host**: `String`, host ip

**port**: `Number`, port numer

**Returns**: `object`

### sonos.Helpers.TimeToSeconds(time)

Convert a time string to seconds

**Parameters**:

**time**: `String`, like `00:03:34`

**Returns**: `Number`, number of seconds like 214

### sonos.Helpers.TranslateState(state)

Convert the playbackstate to a bit more readable

**Parameters**:

**state**: `String`, Sonos playback state


### sonos.Helpers.ParseXml(input)

Parse Xml to an object async

**Parameters**:

**input**: `String`, The XML to be parsed

**Returns**: `Promise`

* * *
