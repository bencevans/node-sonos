
/**
 * Dependencies
 */

var request = require('request'),
    parseString = require('xml2js').parseString,
    _ = require('underscore');

/**
 * Helpers
 */

var withinEnvelope = function(body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
  '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
  '  <s:Body>' + body + '</s:Body>',
  '</s:Envelope>'].join('');
};

/**
 * "Class" Service
 */

var Service = function(options) {
  this.name = options.name;
  this.host = options.host;
  this.port = options.port || 1400;
  this.controlURL = options.controlURL;
  this.eventSubURL = options.eventSubURL;
  this.SCPDURL = options.SCPDURL;
  return this;
};

Service.prototype._request = function(action, variables, callback) {
  var message_action = '"urn:schemas-upnp-org:service:' + this.name + ':1#' + action + '"';
  var message_body_pre = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + this.name + ':1">';
  var message_body_post = '</u:' + action + '>';
  var message_body = message_body_pre + _.map(variables, function(value, key) {
    return '<' + key + '>' + value + '</' + key + '>';
  }).join('') + message_body_post;
  var responseTag = 'u:' + action + 'Response';

  request({
    uri: 'http://' + this.host + ':' + this.port + this.controlURL,
    method: 'POST',
    headers: {
      'SOAPAction': message_action,
      'Content-type': 'text/xml; charset=utf8'
    },
    body: withinEnvelope(message_body)
  }, function(err, res, body) {
    if (err) return callback(err);

    parseString(body, function(err, json) {
      if (err) return callback(err);

      if(typeof json['s:Envelope']['s:Body'][0]['s:Fault'] !== 'undefined') {
        return callback(new Error(json['s:Envelope']['s:Body'][0]['s:Fault'][0].faultstring[0] +
        ': ' + json['s:Envelope']['s:Body'][0]['s:Fault'][0].detail[0].UPnPError[0].errorCode[0]));
      }

      var output = json['s:Envelope']['s:Body'][0][responseTag][0];
      delete output.$;
      _.each(output, function(item, key) {
        output[key] = item[0];
      });
      return callback(null, output);
    });
  });
};

module.exports = Service;