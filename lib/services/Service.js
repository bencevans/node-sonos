/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'request'
 * @requires 'request-promise-native'
 * @requires 'xml2js'
 * @requires 'debug'
 * @requires '../helpers
 */

const request = require('request-promise-native')
const parseString = require('xml2js').parseString
const debug = require('debug')('sonos-service')
const Helpers = require('../helpers')

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
 * @returns {Object} The result of the request.
 */
Service.prototype._request = function (action, variables) {
  debug('Service._request(%j %j)', action, variables)
  return new Promise((resolve, reject) => {
    let messageAction = '"urn:schemas-upnp-org:service:' + this.name + ':1#' + action + '"'
    let messageBody = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + this.name + ':1">'
    if (variables) {
      Object.keys(variables).forEach(key => {
        messageBody += '<' + key + '>' + variables[key] + '</' + key + '>'
      })
    }
    messageBody += '</u:' + action + '>'
    var responseTag = 'u:' + action + 'Response'
    request({
      uri: 'http://' + this.host + ':' + this.port + this.controlURL,
      method: 'POST',
      headers: {
        'SOAPAction': messageAction,
        'Content-type': 'text/xml; charset=utf8'
      },
      body: Helpers.CreateSoapEnvelop(messageBody)
    }).then(Helpers.ParseXml)
      .then(result => {
        debug('Parsed service response as JSON\n%s', JSON.stringify(result, null, 2))
        if (!result || !result['s:Envelope']) {
          reject('Invalid response for ' + action + ': ' + result)
        } else if (typeof result['s:Envelope']['s:Body']['s:Fault'] !== 'undefined') {
          reject(result['s:Envelope']['s:Body']['s:Fault'])
        } else {
          let output = result['s:Envelope']['s:Body'][responseTag]
          // Remove namespace from result
          delete output['xmlns:u']
          resolve(output)
        }
      })
      .catch(reject)
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
  debug('Service._parseKey(%j, %j)', key, callback)
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

Service.prototype.debug = debug

module.exports = Service
