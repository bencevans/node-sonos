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

  #
  # Structure, Send, Receive and Format HTTP Request
  #
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
        console.log JSON.stringify json["s:Envelope"]['s:Body'], null, 2
        callback null, json["s:Envelope"]['s:Body'][0][responseTag]

  #
  # Get the Current Track Info
  #
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


  play: (uri, callback) ->
    if callback? and uri?
      # Play URL
      @queueNext uri, (err, queued) ->
        if err then return callback err
        console.log err, queued

    else if uri?
      # Just Play
      callback = uri
      action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"'
      body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>'
      @request TRANSPORT_ENDPOINT, action, body, "u:PlayResponse", (err, data) ->
        if data[0]["$"]["xmlns:u"] is "urn:schemas-upnp-org:service:AVTransport:1"
          return callback null, true
        else
          return callback new Error({err:err, data:data}), false
    else
      throw new Error "Please Provide Callback"

  stop: (callback) ->
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Stop"'
    body = '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>'
    @request TRANSPORT_ENDPOINT, action, body, "u:StopResponse", (err, data) ->
      if data[0]["$"]["xmlns:u"] is "urn:schemas-upnp-org:service:AVTransport:1"
        return callback null, true
      else
        return callback new Error({err:err, data:data}), false

  pause: (callback) ->
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"'
    body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>'
    @request TRANSPORT_ENDPOINT, action, body, "u:PauseResponse", (err, data) ->
      if data[0]["$"]["xmlns:u"] is "urn:schemas-upnp-org:service:AVTransport:1"
        return callback null, true
      else
        return callback new Error({err:err, data:data}), false

  next: (callback) ->
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Next"'
    body = '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>'
    @request TRANSPORT_ENDPOINT, action, body, "u:NextResponse", (err, data) ->
      if err then return callback err
      if data[0]["$"]["xmlns:u"] is "urn:schemas-upnp-org:service:AVTransport:1"
        return callback null, true
      else
        return callback new Error({err:err, data:data}), false

  queueNext: (uri, callback) ->
    console.log uri
    action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"'
    body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + uri + '</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>'
    response = @request TRANSPORT_ENDPOINT, action, body, "u:SetAVTransportURIResponse", (err, data) ->
      callback err, data


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