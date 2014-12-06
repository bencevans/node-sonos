var async = require('async');
var request = require('request');
var http = require('http');
var ip = require('ip');
var xml2js = require('xml2js');
var util = require('util');
var _ = require('underscore');
var events = require('events');

/**
 * Listener "Class"
 * @param {Sonos}  device Corresponding Sonos device
 */
function Listener(device) {
  this.device = device;
  this.parser = new xml2js.Parser();
  this.services = {};
  this.serviceEndpoints = {};
};

util.inherits(Listener, events.EventEmitter);

Listener.prototype._startInternalServer = function(callback) {

  this.server = http.createServer(function(req, res) {
    var buffer = '';
    req.on('data', function(d) {
      buffer += d;
    });

    req.on('end', function() {
      req.body = buffer;
      this._messageHandler(req, res);

    }.bind(this));

  }.bind(this)).listen(0, function() {
    var port = this.server.address().port;
    this.port = port;
    callback(null, port);

  }.bind(this));

};

/**
 * Add event handler to the endpoint
 * @param  {String}   serviceEndpoint Endpoint to subscribe to
 * @param  {Function} handler         handler to call for events
 * @param  {Function} callback        {err, sonosServiceId}
 */
Listener.prototype.addHandler = function(serviceEndpoint, handler, callback) {

  this.on('serviceEvent', function(endpoint, sid, data) {
    if (endpoint == serviceEndpoint) {
      handler(data);
    }
  });

  if (!this.serviceEndpoints[serviceEndpoint])
    this._addService(serviceEndpoint, callback);
};

/**
 * Remove all handlers from endpoint
 * @param  {Function} callback        {err, results}
 */
Listener.prototype.removeAllHandlers = function(callback) {

  this.removeAllListeners('serviceEvent');

  async.parallel(Object.keys(this.services).map(function(sid) {
    return function(cb) {
      this._removeService(sid, cb);
    }.bind(this);
  }.bind(this)), callback);

};

Listener.prototype._messageHandler = function(req, res) {

  if (req.method.toUpperCase() === 'NOTIFY' && req.url.toLowerCase() === '/notify') {

    if (!this.services[req.headers.sid])
      return;

    var thisService = this.services[req.headers.sid];

    var items = thisService.data || {};
    this.parser.parseString(req.body.toString(), function(error, data) {
      _.each(data['e:propertyset']['e:property'], function(element) {
        _.each(_.keys(element), function(key) {
          items[key] = element[key][0];
        });
      });

      this.emit('serviceEvent', thisService.endpoint, req.headers.sid, thisService.data);
      res.end();
    }.bind(this));

  }
};

Listener.prototype._addService = function(serviceEndpoint, callback) {
  if (!this.server) {
    callback(new Error('Service endpoints can only be added after listen() is finished'));
  } else if (this.serviceEndpoints[serviceEndpoint]) {
    callback(new Error('Service endpoint already added (' + serviceEndpoint + ')'));
  } else {

    var opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + serviceEndpoint,
      method: 'SUBSCRIBE',
      headers: {
        callback: '<http://' + ip.address() + ':' + this.port + '/notify>',
        NT: 'upnp:event',
        Timeout: 'Second-3600'
      }
    };

    request(opt, function(err, response) {
      if (err || response.statusCode !== 200) {
        callback(err || response.statusMessage);
      } else {
        var sid = response.headers.sid;

        this.services[sid] = {
          endpoint: serviceEndpoint,
          data: {}
        };

        this.serviceEndpoints[serviceEndpoint] = sid;

        if (callback)
          callback(null, sid);
      }
    }.bind(this));

  }
};

Listener.prototype._removeService = function(sid, callback) {

  if (!this.server) {
    callback(new Error('Service endpoints can only be modified after listen() is called'));
  } else if (!this.services[sid]) {
    callback(new Error('Service with sid ' + sid + ' is not registered'));
  } else {

    var opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + this.services[sid].endpoint,
      method: 'UNSUBSCRIBE',
      headers: {
        sid: sid
      }
    };

    request(opt, function(err, response) {
      if (err || response.statusCode !== 200) {
        callback(err || response.statusCode);
      } else {

        callback(null, true);
      }
    });
  }

};


Listener.prototype.listen = function(callback) {
  if (!this.server) {
    this._startInternalServer(callback);
  } else {
    callback(new Error('Service listener is already listening'));
  }
};

module.exports = Listener;
