
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
    if(err) return callback(err);

    var metadata = data[0].TrackMetaData;
    if (metadata) {
      return (new xml2js.Parser()).parseString(metadata, function(err, data) {
        if(err) return callback(err, data);
        var _ref, _ref1, _ref2;

        var item = data['DIDL-Lite'].item[0];
        if (item) {
          return callback(null, {
            title: (_ref = item['dc:title'][0]) !== null ? _ref : null,
            artist: (_ref1 = item['dc:creator'][0]) !== null ? _ref1 : null,
            album: (_ref2 = item['upnp:album'][0]) !== null ? _ref2 : null,
            albumArtURI: 'http://' + _this.host + ':' + _this.port + item['upnp:albumArtURI'][0]
          });
        } else {
          console.log('here');
          return callback(null, null);
        }

      });
    } else {
      return callback(null, null);
    }
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
  if ((callback !== null) && (uri !== null)) {
    return this.queueNext(uri, function(err, queued) {
      if (err) {
        return callback(err);
      }
      return callback(err, queued);
    });
  } else if (uri !== null) {
    callback = uri;
    action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"';
    body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>';
    return this.request(TRANSPORT_ENDPOINT, action, body, "u:PlayResponse", function(err, data) {
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
 * Pasue Current Queue
 * @param  {Function} callback (err, paused)
 * @return {Void}
 */
Sonos.prototype.pause = function(callback) {
  debug('Sonos.pause(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"';
  body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>';
  return this.request(TRANSPORT_ENDPOINT, action, body, 'u:PauseResponse', function(err, data) {
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
 * Get the LED State
 * @param  {Function} callback (err, state) state is a string, "On" or "Off"
 */
 Sonos.prototype.getLEDState = function(callback) {
  debug('Sonos.getLEDState(%j)', callback);
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"';
  var body = '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>';
  this.request(DEVICE_ENDPOINT, action, body, 'u:GetLEDStateResponse', function(err, data) {
    if(err) return callback(err, data);
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
