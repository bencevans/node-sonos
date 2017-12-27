var request = require('request')
var http = require('http')
var ip = require('ip')
var xml2js = require('xml2js')
var util = require('util')
var _ = require('underscore')
var events = require('events')

var Listener = function (device, options) {
  this.device = device
  this.parser = new xml2js.Parser()
  this.services = {}
  this.options = options || {'interface': 'public'} // If you want to use a different interface for listening, specify the name in options.interface
}

util.inherits(Listener, events.EventEmitter)

Listener.prototype._startInternalServer = function (callback) {
  this.port = 0
  if ('port' in this.options) {
    this.port = this.options.port
  }

  this.server = http.createServer(function (req, res) {
    var buffer = ''
    req.on('data', function (d) {
      buffer += d
    })

    req.on('end', function () {
      req.body = buffer
      this._messageHandler(req, res)
    }.bind(this))
  }.bind(this)).listen(this.port, function () {
    if (this.port === 0) {
      this.port = this.server.address().port
    }
    callback(null, this.port)

    setInterval(this._renewServices.bind(this), 1 * 1000)
  }.bind(this))
}

Listener.prototype._messageHandler = function (req, res) {
  if (req.method.toUpperCase() === 'NOTIFY' && req.url.toLowerCase() === '/notify') {
    if (!this.services[req.headers.sid]) {
      return
    }

    var thisService = this.services[req.headers.sid]

    var items = thisService.data || {}
    this.parser.parseString(req.body.toString(), function (error, data) {
      if (error) {
        res.end(500)
      }
      _.each(data['e:propertyset']['e:property'], function (element) {
        _.each(_.keys(element), function (key) {
          items[key] = element[key][0]
        })
      })

      this.emit('serviceEvent', thisService.endpoint, req.headers.sid, thisService.data)
      res.end()
    }.bind(this))
  }
}

Listener.prototype._renewServices = function () {
  var sid

  var now = new Date().getTime()

  var renew = function (sid) {
    return function (err, response) {
      var serviceEndpoint = this.services[sid].endpoint

      if (err || ((response.statusCode !== 200) && (response.statusCode !== 412))) {
        this.emit('error', err || response.statusMessage, serviceEndpoint, sid)
      } else if (response.statusCode === 412) { // restarted, this is why renewal is at most 300sec
        delete this.services[sid]
        this.addService(serviceEndpoint, function (err, sid) {
          if (err) this.emit('error', err, serviceEndpoint, sid)
        })
      } else {
        this.services[sid].renew = this.renew_at(response.headers.timeout)
      }
    }
  }

  for (sid in this.services) {
    var thisService = this.services[sid]

    if (now < thisService.renew) continue

    var opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + thisService.endpoint,
      method: 'SUBSCRIBE',
      headers: {
        SID: sid,
        Timeout: 'Second-3600'
      }
    }

    request(opt, renew(sid).bind(this))
  }
}

Listener.prototype.addService = function (serviceEndpoint, callback) {
  if (!this.server) {
    throw new Error('Service endpoints can only be added after listen() is called')
  } else {
    var opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + serviceEndpoint,
      method: 'SUBSCRIBE',
      headers: {
        callback: '<http://' + ip.address(this.options.interface) + ':' + this.port + '/notify>',
        NT: 'upnp:event',
        Timeout: 'Second-3600'
      }
    }

    request(opt, function (err, response) {
      if (err || response.statusCode !== 200) {
        if (!callback) return console.log(err || response.message || response.statusCode)
        callback(err || response.statusMessage)
      } else {
        callback(null, response.headers.sid)

        this.services[response.headers.sid] = {
          renew: this.renew_at(response.headers.timeout),
          endpoint: serviceEndpoint,
          data: {}
        }
      }
    }.bind(this))
  }
}

Listener.prototype.renew_at = function (timeout) {
  var seconds

  if ((!!timeout) && (timeout.indexOf('Second-') === 0)) timeout = timeout.substr(7)
  seconds = (((!!timeout) && (!isNaN(timeout))) ? parseInt(timeout, 10) : 3600) - 15
  if (seconds < 0) seconds = 15; else if (seconds > 300) seconds = 300

  return (new Date().getTime() + (seconds * 1000))
}

Listener.prototype.listen = function (callback) {
  if (!this.server) {
    this._startInternalServer(callback)
  } else {
    throw new Error('Service listener is already listening')
  }
}

Listener.prototype.removeService = function (sid, callback) {
  if (!this.server) {
    throw new Error('Service endpoints can only be modified after listen() is called')
  } else if (!this.services[sid]) {
    throw new Error('Service with sid ' + sid + ' is not registered')
  } else {
    var opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + this.services[sid].endpoint,
      method: 'UNSUBSCRIBE',
      headers: {
        sid: sid
      }
    }

    request(opt, function (err, response) {
      if (err || response.statusCode !== 200) {
        callback(err || response.statusCode)
      } else {
        callback(null, true)
      }
    })
  }
}

Listener.prototype.stop = function (callback) {
  var self = this
  var keys = Object.keys(this.services)
  if (keys.length > 0) {
    var sid = keys[0]
    self.removeService(sid, function (err, success) {
      if (!err && success) {
        delete self.services[sid]
      }
      self.stop(callback)
    })
  } else {
    delete self.server
    callback(true)
  }
}

module.exports = Listener
