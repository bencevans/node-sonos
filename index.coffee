#
# Constants
#

TRANSPORT_ENDPOINT = "/MediaRenderer/AVTransport/Control"
RENDERING_ENDPOINT = "/MediaRenderer/RenderingControl/Control"
DEVICE_ENDPOINT = "/DeviceProperties/Control"

#
# Require
#

EventEmitter = require("events").EventEmitter
upnp = require "upnp-client"
request = require "request"
xml2js = require "xml2js"

#
# Helpers
#

withinEnvelope = (body) ->
  """
  <?xml version="1.0" encoding="utf-8"?>
  <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>#{body}</s:Body>
  </s:Envelope>
  """

#
# Sonos "Class"
#

class Sonos
  constructor: (@host, @port=1400) ->

  request: (endpoint, action, body, responseTag, callback) ->

    request
      uri: "http://#{@host}:#{@port}#{endpoint}"
      method: "POST"
      headers:
        'SOAPAction': action
        'Content-type': 'text/xml; charset=utf8'
      body: withinEnvelope body
    , (err, res, body) ->
      if err then return callback err
      (new xml2js.Parser()).parseString body, (err, json) ->
        if err then return callback err
        callback null, json["s:Envelope"]['s:Body'][0][responseTag][0]


  currentTrack: (callback) ->
    _this = this
    endpoint = TRANSPORT_ENDPOINT
    action = "urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"
    body = """
    <u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
      <InstanceID>0</InstanceID>
      <Channel>Master</Channel>
    </u:GetPositionInfo>
    """
    responseTag = "u:GetPositionInfoResponse"

    @request endpoint, action, body, responseTag, (err, data) ->
      metadata = data.TrackMetaData
      if metadata
        (new xml2js.Parser()).parseString metadata, (err, data) ->
          unless err
            item = data["DIDL-Lite"].item[0]
            if item
              callback null, {
                title: item['dc:title'][0] ? null
                artist: item['dc:creator'][0] ? null
                album: item['upnp:album'][0] ? null
                albumArtURI: "http://#{_this.host}:#{_this.port}#{item['upnp:albumArtURI'][0]}"
              }
            else
              callback null, null


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