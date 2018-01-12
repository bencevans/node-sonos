/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './request'
 * @requires 'xml2js'
 * @requires 'underscore'
 * @requires 'debug'
 */

const request = require('request')
const parseString = require('xml2js').parseString
const _ = require('underscore')
const debug = require('debug')('sonos-service')

var withinEnvelope = function (body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '  <s:Body>' + body + '</s:Body>',
    '</s:Envelope>'].join('')
}

/**
 * Create a new instance of Service
 * @class Service
 * @param {Object} [options] All the required options to use this class
 * @param {String} options.host The host param of one of your sonos speakers
 * @param {Number} options.port The port of your sonos speaker, defaults to 1400
 * @param {String} options.controlURL The control url used for the calls
 * @param {String} options.eventURL The Event URL used for the calls
 * @param {String} options.SCPDURL The SCPDURL (ask Ben)
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

/**
 * Call the UPNP action
 * @param {String} action The action you want to call
 * @param {Object} variables If this endpoint requires options, put them in here. Otherwise `{ }`
 * @param  {Function} callback (err, result)
 * @return {void}
 */
Service.prototype._request = function (action, variables, callback) {
  debug('Service._request(%j %j %j)', action, variables, callback)
  var messageAction = '"urn:schemas-upnp-org:service:' + this.name + ':1#' + action + '"'
  var messageBodyPre = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + this.name + ':1">'
  var messageBodyPost = '</u:' + action + '>'
  var messageBody = messageBodyPre + _.map(variables, function (value, key) {
    return '<' + key + '>' + value + '</' + key + '>'
  }).join('') + messageBodyPost
  var responseTag = 'u:' + action + 'Response'
  // debug('Message body %s', messageBody)

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
      // Remove namespace from result
      delete output['xmlns:u']
      return callback(null, output)
    })
  })
}

/**
 * Parse a key from the response.
 * @param {Object} input The complete response
 * @param {String} key The key you want parsed
 * @param  {Function} callback (err, result)
 * @return {void}
 */
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

/**
 * Encodes characters not allowed within html/xml tags
 * @param  {String} input This string will be xml encoded
 * @return {String}
 */
Service.prototype.htmlEntities = function (input) {
  return String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

Service.prototype.debug = debug

module.exports = Service
