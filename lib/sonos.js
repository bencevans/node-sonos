
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
    debug = require('debug')('sonos'),
    fs = require('fs'),
    _ = require('underscore');

/**
 * Services
 */

var Services = {};

fs.readdirSync(__dirname + '/services').forEach(function(filename) {
  Services[filename.match(/^(.+)\.js$/)[1]] = require(__dirname + '/services/' + filename);
});


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
 * Encodes characters not allowed within html/xml tags
 * @param  {String} str
 * @return {String}
 */
var htmlEntities = function (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 * Sonos "Class"
 * @param {String} host IP/DNS
 * @param {Number} port
 */
var Sonos = function Sonos(host, port, options) {
  this.host = host;
  this.port = port || 1400;
  this.options = options || {};
  if (!this.options.endpoints) this.options.endpoints = {};
  if (!this.options.endpoints.transport) this.options.endpoints.transport = TRANSPORT_ENDPOINT;
  if (!this.options.endpoints.rendering) this.options.endpoints.rendering = RENDERING_ENDPOINT;
  if (!this.options.endpoints.device)    this.options.endpoints.device    = DEVICE_ENDPOINT;
};

/**
 * UPnP HTTP Request
 * @param  {String}   endpoint    HTTP Path
 * @param  {String}   action      UPnP Call/Function/Action
 * @param  {String}   body
 * @param  {String}   responseTag Expected Response Container XML Tag
 * @param  {Function} callback    (err, data)
 */
Sonos.prototype.request = function(endpoint, action, body, responseTag, callback) {
  debug('Sonos.request(%j, %j, %j, %j, %j)', endpoint, action, body, responseTag, callback);
  request({
    uri: 'http://' + this.host + ':' + this.port + endpoint,
    method: 'POST',
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

      if ((!json) || (!json['s:Envelope']) || (!util.isArray(json['s:Envelope']['s:Body']))) {
        return callback(new Error('Invalid response for ' + action + ': ' + JSON.stringify(json)));
      }

      if(typeof json['s:Envelope']['s:Body'][0]['s:Fault'] !== 'undefined')
        return callback(json['s:Envelope']['s:Body'][0]['s:Fault']);

      return callback(null, json['s:Envelope']['s:Body'][0][responseTag]);
    });
  });
};

/**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {Object}   options     Opitional - default {start: 0, total: 100}
 * @param  {Function} callback (err, result) result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
 */
Sonos.prototype.getMusicLibrary = function(searchType, options, callback){

  var _this = this;

  var searches = {
    'artists': 'A:ARTIST',
    'albumArtists': 'A:ALBUMARTIST',
    'albums': 'A:ALBUM',
    'genres': 'A:GENRE',
    'composers': 'A:COMPOSER',
    'tracks': 'A:TRACKS',
    'playlists': 'A:PLAYLISTS',
    'share': 'S:'
  };

  var defaultOptions = {
    BrowseFlag: 'BrowseDirectChildren',
    Filter: '*',
    StartingIndex: '0',
    RequestedCount: '100',
    SortCriteria: ''
  };

  var opts = {
    ObjectID: searches[searchType]
  };

  if(options.start !== undefined) opts.StartingIndex = options.start;
  if(options.total !== undefined) opts.RequestedCount = options.total;

  opts = _.extend(defaultOptions, opts);

  var contentDirectory = new Services.ContentDirectory(this.host, this.port);
  return contentDirectory.Browse(opts, function(err, data){
    if (err) return callback(err);
    return (new xml2js.Parser()).parseString(data.Result, function(err, didl) {
      if (err) return callback(err, data);

      var items = [];

      if ((!didl) || (!didl['DIDL-Lite']) || (!util.isArray(didl['DIDL-Lite'].container))){
        callback(new Error('Cannot parse DIDTL result'), data);
      }

      _.each(didl['DIDL-Lite'].container, function(item){

        var albumArtURL = null;

        if(util.isArray(item['upnp:albumArtURI'])) {
          if(item['upnp:albumArtURI'][0].indexOf('http') !== -1) {
            albumArtURL = item['upnp:albumArtURI'][0];
          }
          else {
            albumArtURL = 'http://' + _this.host + ':' + _this.port + item['upnp:albumArtURI'][0];
          }

        }
        items.push(
          {
            'title': util.isArray(item['dc:title']) ? item['dc:title'][0] : null,
            'artist': util.isArray(item['dc:creator']) ? item['dc:creator'][0] : null,
            'albumArtURL': albumArtURL,
            'uri': util.isArray(item.res) ? item.res[0]._ : null
          }
        );
      });

      var result = {
        returned: data.NumberReturned,
        total: data.TotalMatches,
        items: items
      };

      return callback(null, result);
    });
  });
};

/**
 * Get Current Track
 * @param  {Function} callback (err, track)
 */
Sonos.prototype.currentTrack = function(callback) {
  debug('Sonos.currentTrack(' + ((callback) ? 'callback' : '') + ')');

  var _this = this;

  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"';
  var body = '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>';
  var responseTag = 'u:GetPositionInfoResponse';

  return this.request(this.options.endpoints.transport, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    if ((!util.isArray(data)) || (data.length < 1)) return {};
    var metadata = data[0].TrackMetaData;
    var position = (parseInt(data[0].RelTime[0].split(':')[0], 10) * 60 * 60) +
                   (parseInt(data[0].RelTime[0].split(':')[1], 10) * 60) +
                   parseInt(data[0].RelTime[0].split(':')[2], 10);

    var duration = (parseInt(data[0].TrackDuration[0].split(':')[0], 10) * 60 * 60) +
                   (parseInt(data[0].TrackDuration[0].split(':')[1], 10) * 60) +
                   parseInt(data[0].TrackDuration[0].split(':')[2], 10);

    if ((metadata) && (metadata[0].length > 0) && metadata[0] !== 'NOT_IMPLEMENTED') {
      return (new xml2js.Parser()).parseString(metadata, function(err, data) {
        var track;

        if (err) return callback(err, data);

        track = _this.parseDIDL(data);
        track.position = position;
        track.duration = duration;
        track.albumArtURL = !track.albumArtURI ? null
                            : (track.albumArtURI.indexOf('http') !== -1) ? track.albumArtURI
                            : 'http://' + _this.host + ':' + _this.port + track.albumArtURI;

        return callback(null, track);
      });
    } else {
      var track = { position: position, duration: duration };

      if (!!data[0].TrackURI) track.uri = data[0].TrackURI[0];
      return callback(null, track);
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
  return {
    title: util.isArray(item['dc:title']) ? item['dc:title'][0]: null,
    artist: util.isArray(item['dc:creator']) ? item['dc:creator'][0]: null,
    album: util.isArray(item['upnp:album']) ? item['upnp:album'][0]: null,
    albumArtURI : util.isArray(item['upnp:albumArtURI']) ? item['upnp:albumArtURI'][0] : null
  };
};

/**
 * Get Current Volume
 * @param  {Function} callback (err, volume)
 */
Sonos.prototype.getVolume = function(callback) {
  debug('Sonos.getVolume(' + ((callback) ? 'callback' : '') + ')');

  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"';
  var body = '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>';
  var responseTag = 'u:GetVolumeResponse';

  return this.request(this.options.endpoints.rendering, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    callback(null, parseInt(data[0].CurrentVolume[0], 10));
  });
};

/**
 * Get Current Muted
 * @param  {Function} callback (err, muted)
 */
Sonos.prototype.getMuted = function(callback) {
  debug('Sonos.getMuted(' + ((callback) ? 'callback' : '') + ')');

  var action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"';
  var body = '<u:GetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>';
  var responseTag = 'u:GetMuteResponse';

  return this.request(this.options.endpoints.rendering, action, body, responseTag, function(err, data) {
    if (err) return callback(err);

    callback(null, parseInt(data[0].CurrentMute[0], 10) ? true : false);
  });
};

/**
 * Resumes Queue or Plays Provided URI
 * @param  {String|Object}   uri      Optional - URI to a Audio Stream or Object with play options
 * @param  {Function} callback (err, playing)
 */
Sonos.prototype.play = function(uri, callback) {
  debug('Sonos.play(%j, %j)', uri, callback);
  var action, body, self = this;

  var cb = (typeof uri === 'function' ? uri : callback) || function() {};
  var options = (typeof uri === 'object' ? uri : {});
  if (typeof uri === 'object') {
    options.uri = uri.uri;
    options.metadata = uri.metadata;
  } else {
    options.uri = (typeof uri === 'string' ? uri : undefined);
  }

  if (options.uri) {

    return this.queueNext({
      uri: options.uri,
      metadata: options.metadata
    }, function(err) {
      if (err) {
        return cb(err);
      }
      return self.play(cb);
    });
  } else {

    action = '"urn:schemas-upnp-org:service:AVTransport:1#Play"';
    body = '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>';
    return this.request(this.options.endpoints.transport, action, body, 'u:PlayResponse', function(err, data) {
      if (err) return cb(err);

      if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
        return cb(null, true);
      } else {
        return cb(new Error({
          err: err,
          data: data
        }), false);
      }
    });
  }
};

/**
 * Stop What's Playing
 * @param  {Function} callback (err, stopped)
 */
Sonos.prototype.stop = function(callback) {
  debug('Sonos.stop(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Stop"';
  body = '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>';
  return this.request(this.options.endpoints.transport, action, body, 'u:StopResponse', function(err, data) {
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
 */
Sonos.prototype.pause = function(callback) {
  debug('Sonos.pause(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Pause"';
  body = '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>';
  return this.request(this.options.endpoints.transport, action, body, 'u:PauseResponse', function(err, data) {
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
  return this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse', function(err, data) {
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
 * Select specific track in queue
 * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
 * @param  {Function} callback (err, data)
 */
Sonos.prototype.selectTrack = function (trackNr, callback) {
  if (typeof trackNr === 'function') {
    callback = trackNr;
    trackNr = 1;
  }
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#Seek"';
  var body = '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>' + trackNr + '</Target></u:Seek>';

  return this.request(this.options.endpoints.transport, action, body, 'u:SeekResponse', function(err, data) {
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
 */
Sonos.prototype.next = function(callback) {
  debug('Sonos.next(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Next"';
  body = '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>';
  this.request(this.options.endpoints.transport, action, body, 'u:NextResponse', function(err, data) {
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
 */
Sonos.prototype.previous = function(callback) {
  debug('Sonos.previous(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#Previous"';
  body = '<u:Previous xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Previous>';
  this.request(this.options.endpoints.transport, action, body, 'u:PreviousResponse', function(err, data) {
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
 * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
 * @param  {Function}  callback (err, data)  Optional
 */
Sonos.prototype.selectQueue = function(callback) {
  debug('Sonos.selectQueue(%j)', callback);
  var cb = callback || function() {};
  var self = this;
  self.getZoneInfo(function(err, data){
    if(!err) {
      var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"';
      var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + 'x-rincon-queue:RINCON_' + data.MACAddress.replace(/:/g, '') + '0' + self.port + '#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>';
      self.request(self.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse', function(err, data) {
        if (err) return cb(err);
        if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
          return cb(null, true);
        } else {
          return cb(new Error({
            err: err,
            data: data
          }), false);
        }
      });
    } else {
      return cb(err);
    }
  });
};

/**
 * Queue a Song Next
 * @param  {String|Object}   uri      URI to Audio Stream or Object containing options (uri, metadata)
 * @param  {Function} callback (err, queued)
 */
Sonos.prototype.queueNext = function(uri, callback) {
  debug('Sonos.queueNext(%j, %j)', uri, callback);

  var options = (typeof uri === 'object' ? uri : { metadata: '' });
  if (typeof uri === 'object') {
    options.metadata = uri.metadata || '';
    options.metadata = htmlEntities(options.metadata);
    options.uri = uri.uri;
  } else {
    options.uri = uri;
  }

  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"';
  var body = '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>' + options.uri + '</CurrentURI><CurrentURIMetaData>' + options.metadata + '</CurrentURIMetaData></u:SetAVTransportURI>';
  this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse', function(err, data) {
    if (callback) {
      return callback(err, data);
    } else {
      return null;
    }
  });
};

/**
 * Add a song to the queue.
 * @param  {String}   uri             URI to Audio Stream
 * @param  {Number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
 *                                    defaults to end of queue, 0 to explicitly set end of queue)
 * @param  {Function} callback (err, queued)
 */
Sonos.prototype.queue = function(uri, positionInQueue, callback) {
  debug('Sonos.queue(%j, %j, %j)', uri, positionInQueue, callback);
  if (typeof positionInQueue === 'function') {
    callback = positionInQueue;
    positionInQueue = 0;
  }
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"';
  var body = '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>' + uri + '</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>' + positionInQueue + '</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>';
  this.request(this.options.endpoints.transport, action, body, 'u:AddURIToQueueResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Flush queue
 * @param  {Function} callback (err, flushed)
 */
Sonos.prototype.flush = function(callback) {
  debug('Sonos.flush(%j)', callback);
  var action, body;
  action = '"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"';
  body = '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>';
  this.request(this.options.endpoints.transport, action, body, 'u:RemoveAllTracksFromQueueResponse', function(err, data) {
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
  this.request(this.options.endpoints.device, action, body, 'u:GetLEDStateResponse', function(err, data) {
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
  this.request(this.options.endpoints.device, action, body, 'u:SetLEDStateResponse', function(err) {
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
  this.request(this.options.endpoints.device, action, body, 'u:GetZoneInfoResponse', function(err, data) {
    if (err) return callback(err, data);

    var output = {};
    for (var d in data[0]) if (data[0].hasOwnProperty(d) && d !== '$') output[d] = data[0][d][0];
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
  this.request(this.options.endpoints.device, action, body, 'u:GetZoneAttributesResponse', function(err, data) {
    if (err) return callback(err, data);

    var output = {};
    for (var d in data[0]) if (data[0].hasOwnProperty(d) && d !== '$') output[d] = data[0][d][0];
    callback(null, output);
  });
};

/**
 * Get Information provided by /xml/device_description.xml
 * @param  {Function} callback (err, info)
 */
Sonos.prototype.deviceDescription = function(callback) {
  request({
    uri: 'http://' + this.host + ':' + this.port + '/xml/device_description.xml'
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
 */
Sonos.prototype.setName = function(name, callback) {
  debug('Sonos.setName(%j, %j)', name, callback);
  name = name.replace(/[<&]/g, function(str) { return (str === '&') ? '&amp;' : '&lt;';});
  var action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetZoneAttributes"';
  var body = '"<u:SetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredZoneName>' + name + '</DesiredZoneName><DesiredIcon /><DesiredConfiguration /></u:SetZoneAttributes>"';
  this.request(this.options.endpoints.device, action, body, 'u:SetZoneAttributesResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Set Play Mode
 * @param  {String} playmode
 * @param  {Function} callback (err, data)
 * @return {[type]}
 */
Sonos.prototype.setPlayMode = function(playmode, callback) {
  debug('Sonos.setPlayMode(%j, %j)', playmode, callback);
  var mode = { NORMAL: true, REPEAT_ALL: true, SHUFFLE: true, SHUFFLE_NOREPEAT: true }[playmode.toUpperCase()];
  if (!mode) return callback (new Error('invalid play mode ' + playmode));
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#SetPlayMode"';
  var body = '<u:SetPlayMode xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewPlayMode>' + playmode.toUpperCase() + '</NewPlayMode></u:SetPlayMode>';
  this.request(this.options.endpoints.transport, action, body, 'u:SetPlayModeResponse', function(err, data) {
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
  this.request(this.options.endpoints.rendering, action, body, 'u:SetVolumeResponse', function(err, data) {
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
  this.request(this.options.endpoints.rendering, action, body, 'u:SetMutedResponse', function(err, data) {
    return callback(err, data);
  });
};

/**
 * Get Zones in contact with current Zone with Group Data
 * @param  {Function} callback (err, topology)
 */
Sonos.prototype.getTopology = function(callback) {
  debug('Sonos.getTopology(%j)', callback);
  request('http://' + this.host + ':' + this.port + '/status/topology', function(err, res, body) {
    if(err) return callback(err);
    debug(body);
    xml2js.parseString(body, function(err, topology) {
      if(err) return callback(err);
      var info = topology.ZPSupportInfo;
      var zones = null, mediaServers = null;

      if (info.ZonePlayers && info.ZonePlayers.length > 0) {
        zones = _.map(info.ZonePlayers[0].ZonePlayer, function(zone) {
          return _.extend(zone.$, {name: zone._});
        });
      }

      if (info.MediaServers && info.MediaServers.length > 0) {
        mediaServers = _.map(info.MediaServers[0].MediaServer, function(zone) {
          return _.extend(zone.$, {name: zone._});
        });
      }

      callback(null, {
        zones: zones,
        mediaServers: mediaServers
      });
    });
  });
};

/**
 * Get Current Playback State
 * @param  {Function} callback (err, state)
 */
Sonos.prototype.getCurrentState = function(callback) {
  debug('Sonos.currentState(%j)', callback);
  var action = '"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"';
  var body = '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>';
  var state = null;

  return this.request(this.options.endpoints.transport, action, body, 'u:GetTransportInfoResponse', function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (JSON.stringify(data[0].CurrentTransportState) === '["STOPPED"]') {
      state = 'stopped';
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["PLAYING"]') {
      state = 'playing';
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["PAUSED_PLAYBACK"]') {
      state = 'paused';
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["TRANSITIONING"]') {
      state = 'transitioning';
    } else if (JSON.stringify(data[0].CurrentTransportState) === '["NO_MEDIA_PRESENT"]') {
      state = 'no_media';
    }

    return callback(err, state);
  });
};




/**
 * Search "Class"
 * Emits 'DeviceAvailable' on a Sonos Component Discovery
 */
var Search = function Search(options) {

  var _this = this;

  var PLAYER_SEARCH = new Buffer(['M-SEARCH * HTTP/1.1',
  'HOST: 239.255.255.250:1900',
  'MAN: ssdp:discover',
  'MX: 1',
  'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'));

  this.socket = dgram.createSocket('udp4', function(buffer, rinfo) {
    buffer = buffer.toString();

    if(buffer.match(/.+Sonos.+/)) {
      var modelCheck = buffer.match(/SERVER.*\((.*)\)/);
      var model = (modelCheck.length > 1 ? modelCheck[1] : null);

      _this.emit('DeviceAvailable', new Sonos(rinfo.address), model);
    }
  });

  this.socket.on('error', function(err) {
    _this.emit('error', err);
  });

  this.socket.bind(function() {
    _this.socket.setBroadcast(true);
    _this.socket.send(PLAYER_SEARCH, 0, PLAYER_SEARCH.length, 1900, '239.255.255.250');
  });

  if (options.timeout) {
    setTimeout(function() {
      _this.socket.close();
    }, options.timeout);
  }

  return this;

};

util.inherits(Search, EventEmitter);

/**
 * Create a Search Instance (emits 'DeviceAvailable' with a found Sonos Component)
 * @param  {Object} options Optional Options to control search behavior.
 *                          Set 'timeout' to how long to search for devices
 *                          (in milliseconds).
 * @param  {Function} listener Optional 'DeviceAvailable' listener (sonos)
 * @return {Search/EventEmitter Instance}
 */
var search = function(options, listener) {
  if (typeof options === 'function') {
    listener = options;
    options = null;
  }
  options = options || {};
  listener = listener || null;

  var search = new Search(options);

  if(listener !== null)
    search.on('DeviceAvailable', listener);

  return search;
};

/**
 * Export
 */

module.exports.Sonos = Sonos;
module.exports.search = search;
module.exports.Services = Services;
