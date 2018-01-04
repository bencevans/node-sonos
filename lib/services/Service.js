/**
 * Dependencies
 */

var request = require('request')
var parseString = require('xml2js').parseString
var _ = require('underscore')
var debug = require('debug')('sonos-service')

  /**
   * Helpers
   */

var withinEnvelope = function (body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '  <s:Body>' + body + '</s:Body>',
    '</s:Envelope>'].join('')
}

/**
 * "Class" Service
 */

var Service = function (options) {
  this.name = options.name
  this.host = options.host
  this.port = options.port || 1400
  this.controlURL = options.controlURL
  this.eventSubURL = options.eventSubURL
  this.SCPDURL = options.SCPDURL
  return this
}

Service.prototype._request = function (action, variables, callback) {
  debug('Service._request(%j %j %j)', action, variables, callback)
  var messageAction = '"urn:schemas-upnp-org:service:' + this.name + ':1#' + action + '"'
  var messageBodyPre = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + this.name + ':1">'
  var messageBodyPost = '</u:' + action + '>'
  var messageBody = messageBodyPre + _.map(variables, function (value, key) {
    return '<' + key + '>' + value + '</' + key + '>'
  }).join('') + messageBodyPost
  var responseTag = 'u:' + action + 'Response'

  request({
    uri: 'http://' + this.host + ':' + this.port + this.controlURL,
    method: 'POST',
    headers: {
      'SOAPAction': messageAction,
      'Content-type': 'text/xml; charset=utf8'
    },
    body: withinEnvelope(messageBody)
  }, function (err, res, body) {
    if (err) return callback(err)

    parseString(body, {mergeAttrs: true, explicitArray: false}, function (err, json) {
      if (err) return callback(err)

      debug('Parsed service response as JSON\n%s', JSON.stringify(json, null, 2))

      if (typeof json['s:Envelope']['s:Body']['s:Fault'] !== 'undefined') {
        return callback(new Error(json['s:Envelope']['s:Body']['s:Fault'].faultstring +
          ': ' + json['s:Envelope']['s:Body']['s:Fault'].detail.UPnPError.errorCode))
      }

      var output = json['s:Envelope']['s:Body'][responseTag]
      // delete output.$
      // _.each(output, function (item, key) {
      //   output[key] = item[0]
      // })
      return callback(null, output)
    })
  })
}

Service.prototype._parseKey = function (input, key, callback) {
  debug('Service._parseKey(%j, %j, %j)', input, key, callback)
  if (!input || !key || !callback) {
    debug('_parseKey something not defined')
  }

  if (typeof input[key] === 'undefined') {
    return callback(new Error('Key doesn\'t exists'))
  }

  parseString(input[key], {mergeAttrs: true, explicitArray: false}, (err, result) => {
    if (err) return callback(err)
    return callback(null, result)
  })
}

module.exports = Service
