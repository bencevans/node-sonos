
/**
 * Constants
 */

var TRANSPORT_ENDPOINT = '/MediaRenderer/AVTransport/Control';
var RENDERING_ENDPOINT = '/MediaRenderer/RenderingControl/Control';
var DEVICE_ENDPOINT = '/DeviceProperties/Control';

/**
 * Dependencies
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var upnp = require('upnp-client');
var request = require('request');
var xml2js = require('xml2js');
var debug = require('debug')('sonos');

/**
 * Helpers
 */

/**
 * Wrap in UPnP Envelope
 * @param  {String} body
 * @return {String}
 */
var withinEnvelope = function(body) {
  return ['<?xml version=\"1.0\" encoding=\"utf-8\"?>',
  '<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">',
  '  <s:Body>" + body + "</s:Body>',
  '</s:Envelope>'].join('\n');
};

/**
 * Sonos "Class"
 * @param {String} host IP/DNS
 * @param {Number} port
 */
var Sonos = function Sonos(host, port) {
  this.host = host;
  this.port = port !== null ? port : 1400;
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
  debug('Sonos.currentTrack(%j)', callback);

  var _this = this;

  var action = 'urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo';
  var body = '<u:GetPositionInfo xmlns:u=\"urn:schemas-upnp-org:service:AVTransport:1\">\n  <InstanceID>0</InstanceID>\n  <Channel>Master</Channel>\n</u:GetPositionInfo>';
  var responseTag = 'u:GetPositionInfoResponse';

  return this.request(TRANSPORT_ENDPOINT, action, body, responseTag, function(err, data) {
    if(err) return callback(err);
    console.log(err);
    var metadata = data[0].TrackMetaData;
    if (metadata) {
      return (new xml2js.Parser()).parseString(metadata, function(err, data) {
        var _ref, _ref1, _ref2;
        if (!err) {
          var item = data['DIDL-Lite'].item[0];
          if (item) {
            return callback(null, {
              title: (_ref = item['dc:title'][0]) !== null ? _ref : null,
              artist: (_ref1 = item['dc:creator'][0]) !== null ? _ref1 : null,
              album: (_ref2 = item['upnp:album'][0]) !== null ? _ref2 : null,
              albumArtURI: 'http://' + _this.host + ':' + _this.port + item['upnp:albumArtURI'][0]
            });
          } else {
            return callback(null, null);
          }
        }
      });
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
      return console.log(err, queued);
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
 * Search "Class"
 * Emits 'DeviceAvailable' on a Sonos Component Discovery
 */
Search = function Search() {
  var _this = this;
  var controlPoint = new upnp.ControlPoint();
  controlPoint.on('DeviceAvailable', function(device) {
    if (device.server.match(/Sonos/)) {
      debug('Sonos DeviceAvailable: %j', device);
      return _this.emit('DeviceAvailable', new Sonos(device.host, device.port));
    } else {
      debug('DeviceAvailable but not Sonos' + device.server);
    }
  });
  controlPoint.search();
};

util.inherits(Search, EventEmitter);

/**
 * Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)
 * @return {Search/EventEmitter Instance}
 */
search = function() {
  return new Search();
};

/**
 * Export
 */

module.exports.Sonos = Sonos;
module.exports.search = search;
