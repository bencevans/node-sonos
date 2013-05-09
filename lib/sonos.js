
/**
 * Constants
 */

var TRANSPORT_ENDPOINT = '/MediaRenderer/AVTransport/Control',
    RENDERING_ENDPOINT = '/MediaRenderer/RenderingControl/Control',
    DEVICE_ENDPOINT = '/DeviceProperties/Control';

/**
 * Dependencies
 */

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    dgram = require('dgram'),
    request = require('request'),
    xml2js = require('xml2js'),
    debug = require('debug')('sonos');

/**
 * Helpers
 */

/**
 * Wrap in UPnP Envelope
 * @param  {String} body
 * @return {String}
 */
var withinEnvelope = function(body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
  '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
  '  <s:Body>' + body + '</s:Body>',
  '</s:Envelope>'].join('');
};

/**
 * Sonos "Class"
 * @param {String} host IP/DNS
 * @param {Number} port
 */
var Sonos = function Sonos(host, port) {
  this.host = host;
  this.port = port || 1400;
};

/**
 * UPnP HTTP Request
 * @param  {String}   endpoint    HTTP Path
 * @param  {String}   action      UPnP Call/Function/Action
 * @param  {String}   body
 * @param  {String}   responseTag Expected Response Container XML Tag
 * @param  {Function} callback    (err, data)
 * @return {Void}
 */
Sonos.prototype.request = function(endpoint, action, body, responseTag, callback) {
  debug('Sonos.request(%j, %j, %j, %j, %j)', endpoint, action, body, responseTag, callback);
  request({
    uri: "http://" + this.host + ":" + this.port + endpoint,
    method: "POST",
    headers: {
      'SOAPAction': action,
      'Content-type': 'text/xml; charset=utf8'
    },
    body: withinEnvelope(body)
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback (new Error('HTTP response code ' + res.statusCode + ' for ' + action));

    (new xml2js.Parser()).parseString(body, function(err, json) {
      if (err) return callback(err);

      if(typeof json["s:Envelope"]['s:Body'][0]['s:Fault'] !== 'undefined')
        return callback(json["s:Envelope"]['s:Body'][0]['s:Fault']);

      return callback(null, json["s:Envelope"]['s:Body'][0][responseTag]);
    });
  });
};

/**
 * Get Current Track
 * @param  {Function} callback (err, track)
 * @return {Void}
 */
 Sonos.prototype.currentTrack = function(callback) {
  debug('Sonos.currentTrack(' + ((callback) ? 'callback' : '') + ')');

  var _this = this;

  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"';
  var body = '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>';
  var responseTag = 'u:GetPositionInfoResponse';

  return this.request(TRANSPORT_ENDPOINT, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    if ((!util.isArray(data)) || (data.length < 1)) return {};

    var metadata = data[0].TrackMetaData;
    var position = data[0].RelTime;
    var duration = data[0].TrackDuration;
    if (metadata) {
      return (new xml2js.Parser()).parseString(metadata, function(err, data) {
        var track;

        if (err) return callback(err, data);

        track = _this.parseDIDL(data);
        track.position = position;
        track.duration = duration;

        return callback(null, track);
      });
    } else {
      return callback(null, { position: position, duration: duration });
    }
  });
};

/**
 * Parse DIDL into track structure
 * @param  {String} didl
 * @return {object}
 */
Sonos.prototype.parseDIDL = function(didl) {
  var item;

  if ((!didl) || (!didl['DIDL-Lite']) || (!util.isArray(didl['DIDL-Lite'].item)) || (!didl['DIDL-Lite'].item[0])) return {};
  item = didl['DIDL-Lite'].item[0];

  return { title       : util.isArray(item['dc:title'])         ? item['dc:title'][0]         : null
         , artist      : util.isArray(item['dc:creator'])       ? item['dc:creator'][0]       : null
         , album       : util.isArray(item['upnp:album'])       ? item['upnp:album'][0]       : null
         , albumArtURI : util.isArray(item['upno:AlbumArtURI']) ? item['upnp:AlbumArtURI'][0] : null
         };
};

/**
 * Get Current Volume
 * @param  {Function} callback (err, volume)
 * @return {Void}
 */
 Sonos.prototype.getVolume = function(callback) {
  debug('Sonos.getVolume(' + ((callback) ? 'callback' : '') + ')');

  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"';
  var body = '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>';
  var responseTag = 'u:GetVolumeResponse';

  return this.request(RENDERING_ENDPOINT, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    callback(null, parseInt(data[0].CurrentVolume[0], 10));
  });
};

/**
 * Get Current Muted
 * @param  {Function} callback (err, muted)
 * @return {Void}
 */
 Sonos.prototype.getMuted = function(callback) {
  debug('Sonos.getMuted(' + ((callback) ? 'callback' : '') + ')');

  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"';
  var body = '<u:GetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>';
  var responseTag = 'u:GetMuteResponse';

  return this.request(RENDERING_ENDPOINT, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    callback(null, parseInt(data[0].CurrentMute[0], 10) ? true : false);
  });
};

/**
 * Resumes Queue or Plays Provided URI
 * @param  {String}   uri      Optional - URI to a Audio Stream
 * @param  {Function} callback (err, playing)
 * @return {Void}
 */
Sonos.prototype.play = function(uri, callback) {
  debug('Sonos.play(%j, %j)', uri, callback);
  var action, body;
  
  if (typeof callback === 'undefined') callback = null;
  if ((callback !== null) && (uri !== null)) {
    return this.queueNext(uri, function(err, queued) {
      if (err) {
        return callback(err);
      }
      return callback(err, queued);
    });
  } else if (typeof uri === 'function') {
    callback = uri;
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"';
    body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>';
    return this.request(TRANSPORT_ENDPOINT, action, body, "u:PlayResponse", function(err, data) {
      if (err) return callback(err);

      if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
        return callback(null, true);
      } else {
        return callback(new Error({
          err: err,
          data: data
        }), false);
      }
    });
  } else {
    throw new Error("Please Provide Callback");
  }
};

/**
 * Stop What's Playing
 * @param  {Function} callback (err, stopped)
 * @return {Void}
 */
Sonos.prototype.stop = function(callback) {
  debug('Sonos.stop(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Stop"';
  body = '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>';
  return this.request(TRANSPORT_ENDPOINT, action, body, 'u:StopResponse', function(err, data) {
    if (err) return callback(err);

    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true);
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false);
    }
  });
};

/**
 * Pause Current Queue
 * @param  {Function} callback (err, paused)
 * @return {Void}
 */
Sonos.prototype.pause = function(callback) {
  debug('Sonos.pause(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"';
  body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>';
  return this.request(TRANSPORT_ENDPOINT, action, body, 'u:PauseResponse', function(err, data) {
    if (err) return callback(err);

    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true);
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false);
    }
  });
};

/**
 * Seek the current track
 * @param  {Function} callback (err, seeked)
 * @return {Void}
 */
Sonos.prototype.seek = function(seconds, callback) {
  debug('Sonos.seek(%j)', callback);
  var action, body, hh, mm, ss;

  hh = Math.floor(seconds / 3600);
  mm = Math.floor((seconds - (hh * 3600)) / 60);
  ss = seconds - ((hh * 3600) + (mm * 60));
  if (hh < 10) hh = '0' + hh;
  if (mm < 10) mm = '0' + mm;
  if (ss < 10) ss = '0' + ss;
  

  action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"';
  body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>REL_TIME</Unit><Target>' + hh + ':' + mm + ':' + ss + '</Target></u:Seek>';
  return this.request(TRANSPORT_ENDPOINT, action, body, 'u:SeekResponse', function(err, data) {
    if (err) return callback(err);

    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true);
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false);
    }
  });
};

/**
 * Play next in queue
 * @param  {Function} callback (err, movedToNext)
 * @return {Void}
 */
Sonos.prototype.next = function(callback) {
  debug('Sonos.next(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Next"';
  body = '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>';
  this.request(TRANSPORT_ENDPOINT, action, body, 'u:NextResponse', function(err, data) {
    if (err) {
      return callback(err);
    }
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true);
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false);
    }
  });
};

/**
 * Play previous in queue
 * @param  {Function} callback (err, movedToPrevious)
 * @return {Void}
 */
Sonos.prototype.previous = function(callback) {
  debug('Sonos.previous(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Previous"';
  body = '<u:Previous xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Previous>';
  this.request(TRANSPORT_ENDPOINT, action, body, 'u:PreviousResponse', function(err, data) {
    if (err) {
      return callback(err);
    }
    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
      return callback(null, true);
    } else {
      return callback(new Error({
        err: err,
        data: data
      }), false);
    }
  });
};

/**
 * Queue a Song Next
 * @param  {String}   uri      URI to Audio Stream
 * @param  {Function} callback (err, queued)
 * @return {[type]}
 */
Sonos.prototype.queueNext = function(uri, callback) {
  debug('Sonos.queueNext(%j, %j)', uri, callback);
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"';
  var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + uri + '</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>';
  this.request(TRANSPORT_ENDPOINT, action, body, 'u:SetAVTransportURIResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Flush queue
 * @param  {Function} callback (err, flushed)
 * @return {Void}
 */
Sonos.prototype.flush = function(callback) {
  debug('Sonos.flush(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"';
  body = '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>';
  this.request(TRANSPORT_ENDPOINT, action, body, 'u:RemoveAllTracksFromQueueResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Get the LED State
 * @param  {Function} callback (err, state) state is a string, "On" or "Off"
 */
 Sonos.prototype.getLEDState = function(callback) {
  debug('Sonos.getLEDState(%j)', callback);
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"';
  var body = '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>';
  this.request(DEVICE_ENDPOINT, action, body, 'u:GetLEDStateResponse', function(err, data) {
    if (err) return callback(err, data);
    if(data[0] && data[0].CurrentLEDState && data[0].CurrentLEDState[0])
      return callback(null, data[0].CurrentLEDState[0]);
    callback(new Error('unknown response'));
  });
};

/**
 * Set the LED State
 * @param  {String}   desiredState           "On"/"Off"
 * @param  {Function} callback (err)
 */
Sonos.prototype.setLEDState = function(desiredState, callback) {
  debug('Sonos.setLEDState(%j, %j)', desiredState, callback);
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetLEDState"';
  var body = '<u:SetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredLEDState>' + desiredState + '</DesiredLEDState></u:SetLEDState>';
  this.request(DEVICE_ENDPOINT, action, body, 'u:SetLEDStateResponse', function(err) {
    return callback(err);
  });
};

/**
 * Get Zone Info
 * @param  {Function} callback (err, info)
 */
 Sonos.prototype.getZoneInfo = function(callback) {
  debug('Sonos.getZoneInfo(%j)', callback);
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"';
  var body = '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>';
  this.request(DEVICE_ENDPOINT, action, body, 'u:GetZoneInfoResponse', function(err, data) {
    if (err) return callback(err, data);

    var output = {};
    for (var d in data[0]) if (data[0].hasOwnProperty(d)) output[d] = data[0][d][0];
    callback(null, output);
  });
};

/**
 * Get Zone Attributes
 * @param  {Function} callback (err, data)
 */
Sonos.prototype.getZoneAttrs = function(callback) {
  debug('Sonos.getZoneAttrs(%j, %j)', callback);

  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"';
  var body = '"<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:SetZoneAttributes>"';
  this.request(DEVICE_ENDPOINT, action, body, 'u:GetZoneAttributesResponse', function(err, data) {
    if (err) return callback(err, data);

    var output = {};
    for (var d in data[0]) if (data[0].hasOwnProperty(d)) output[d] = data[0][d][0];
    callback(null, output);
  });
};

Sonos.prototype.deviceDescription = function(callback) {
  request({
    uri: "http://" + this.host + ":" + this.port + '/xml/device_description.xml'
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(new Error('non 200 errorCode'));
    (new xml2js.Parser()).parseString(body, function(err, json) {
      if (err) return callback(err);
      var output = {};
      for (var d in json.root.device[0]) if (json.root.device[0].hasOwnProperty(d)) output[d] = json.root.device[0][d][0];
      callback(null, output);
    });
  });
};

/**
 * Set Name
 * @param  {String}   name
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setName = function(name, callback) {
  debug('Sonos.setName(%j, %j)', name, callback);
  name = name.replace(/[<&]/g, function(str) { return (str === "&") ? "&amp;" : "&lt;";});
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetZoneAttributes"';
  var body = '"<u:SetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredZoneName>' + name + '</DesiredZoneName><DesiredIcon /><DesiredConfiguration /></u:SetZoneAttributes>"';
  this.request(DEVICE_ENDPOINT, action, body, 'u:SetZoneAttributesResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Set Play Mode
 * @param  {String}   
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setPlayMode = function(playmode, callback) {
  debug('Sonos.setPlayMode(%j, %j)', playmode, callback);
  var mode = { NORMAL: true, REPEAT_ALL: true, SHUFFLE: true, SHUFFLE_NOREPEAT: true }[playmode.toUpperCase()];
  if (!mode) return callback (new Error('invalid play mode ' + playmode));
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetPlayMode"';
  var body = '<u:SetPlayMode xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><DesiredPlayMode>' + mode + '</DesiredPlayMode></u:SetPlayMode>';
  this.request(TRANSPORT_ENDPOINT, action, body, 'u:SetPlayModeResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Set Volume
 * @param  {String}   volume 0..100
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setVolume = function(volume, callback) {
  debug('Sonos.setVolume(%j, %j)', volume, callback);
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"';
  var body = '<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>' + volume + '</DesiredVolume></u:SetVolume>';
  this.request(RENDERING_ENDPOINT, action, body, 'u:SetVolumeResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Set Muted
 * @param  {Boolean}  muted
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setMuted = function(muted, callback) {
  debug('Sonos.setMuted(%j, %j)', muted, callback);
  if (typeof muted === 'string') muted = parseInt(muted, 10) ? true : false;
  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#SetMute"';
  var body = '<u:SetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>' + (muted ? '1' : '0') + '</DesiredMute></u:SetMute>';
  this.request(RENDERING_ENDPOINT, action, body, 'u:SetMutedResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Search "Class"
 * Emits 'DeviceAvailable' on a Sonos Component Discovery
 */
var Search = function Search() {

  var _this = this;

  var PLAYER_SEARCH = new Buffer(["M-SEARCH * HTTP/1.1",
  "HOST: 239.255.255.250:reservedSSDPport",
  "MAN: ssdp:discover",
  "MX: 1",
  "ST: urn:schemas-upnp-org:device:ZonePlayer:1"].join("\r\n"));

  this.socket = dgram.createSocket('udp4', function(buffer, rinfo) {
    if(buffer.toString().match(/.+Sonos.+/)) {
      _this.emit('DeviceAvailable', new Sonos(rinfo.address));
    }
  });

  this.socket.bind();
  this.socket.setBroadcast(true);

  this.socket.send(PLAYER_SEARCH, 0, PLAYER_SEARCH.length, 1900, '239.255.255.250');

  return this;

};

util.inherits(Search, EventEmitter);

/**
 * Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)
 * @param  {Function} Optional 'DeviceAvailable' listener (sonos)
 * @return {Search/EventEmitter Instance}
 */
var search = function(listener) {
  var search = new Search();

  if(typeof listener !== 'undefined')
    search.on('DeviceAvailable', listener);

  return search;
};

/**
 * Export
 */

module.exports.Sonos = Sonos;
module.exports.search = search;
