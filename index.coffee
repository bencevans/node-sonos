#
# Require
#

EventEmitter = require("events").EventEmitter
upnp = require "upnp-client"

#
# Sonos "Class"
#

class Sonos
  constructor: (@host, @port=1400) ->

  currentTrack: (callback) ->

    callback null, {
      playlistPosition: 0
      duration: "00:00"
      uri: "http://positionInfoResponse.TrackURI"
      name: ""
      artist: ""
      album: ""
    }

  play: (url, callback) ->
    callback null, true

  pause: (callback) ->
    callback null, true

#
# Search "Class"
#
# Emits the event "DeviceAvailable" returning a Sonos Instance.
#

class Search extends EventEmitter
  constructor: ->
    _this = @
    controlPoint = new upnp.ControlPoint()
    controlPoint.on "DeviceAvailable", (device) ->
      if device.server.match(/Sonos/)
        console.log device
        _this.emit "DeviceAvailable", new Sonos device.host, device.port
      else
        console.log "no " + device.server

    controlPoint.search()

# Starts Searching for SonosPlayers
search = ->
  return new Search()

#
# Exports
#

module.exports.Sonos =  Sonos
module.exports.search =  search