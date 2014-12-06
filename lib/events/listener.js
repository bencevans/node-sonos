var request = require('request');
var http = require('http');
var ip = require('ip');
var xml2js = require('xml2js');
var util = require('util');
var _ = require('underscore');
var events = require('events');

var Listener = function(device) {
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

Listener.prototype.addService = function(serviceEndpoint, callback) {
  if (!this.server) {
    throw new Error('Service endpoints can only be added after listen() is finished');
  } else if (this.serviceEndpoints[serviceEndpoint]) {
    throw new Error('Service endpoint already added (' + serviceEndpoint + ')');
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
        console.log(response.message || response.statusCode);
        callback(err || response.statusMessage);
      } else {
        var sid = response.headers.sid;

        this.services[sid] = {
          endpoint: serviceEndpoint,
          data: {}
        };

        this.serviceEndpoints[serviceEndpoint] = sid;

        callback(null, sid);
      }
    }.bind(this));

  }
};

Listener.prototype.listen = function(callback) {

  if (!this.server) {
    this._startInternalServer(callback);
  } else {
    throw 'Service listener is already listening';
  }
};

Listener.prototype.removeService = function(sid, callback) {
  if (!this.server) {
    throw 'Service endpoints can only be modified after listen() is called';
  } else if (!this.services[sid]) {
    throw 'Service with sid ' + sid + ' is not registered';
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

module.exports = Listener;