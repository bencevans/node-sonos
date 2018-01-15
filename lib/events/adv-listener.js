/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires 'events'
 * @requires 'request-promise-native'
 * @requires 'debug'
 */

const EventEmitter = require('events').EventEmitter
const request = require('request-promise-native')
const debug = require('debug')('sonos-listener')
const http = require('http')
const ip = require('ip')
const parseXml = require('../helpers').ParseXml

class SonosListener extends EventEmitter {

  constructor () {
    super()
    this._listening = false
    this._deviceSubscriptions = []
    this._handleMessage = function (req, resp) {
      const { method, headers, url } = req
      let body = req.body || null
      debug('Incoming request %s %s %j %s', method, url, headers, body)
      if (method.toUpperCase() !== 'NOTIFY' || url.toLowerCase() !== '/notify') {
        debug('Request cannot be fullfilled')
        resp.end(404)
        return
      } else {
                // Find the subscription matching this sid
        let deviceSubscription = this._deviceSubscriptions.find((el, index, arr) => {
          return el.hasSubscription(headers.sid)
        })

                // If the device subscription isnt't found, we have to return an error
        if (!deviceSubscription) {
          debug('Request received for unknown subscription %s', headers.sid)
          resp.end(404)
          return
        } else {
          parseXml(body)
                        .then(parsedBody => {
                            // Send the parsed body to the device subscription
                          deviceSubscription.handleNotification(headers.sid, parsedBody)
                          resp.end()
                        })
                        .catch(err => {
                          debug('Error parsing the body %j', err)
                          resp.end(500)
                        })
        }
      }
    }

    this._requestHandler = function (req, resp) {
      let body = []
      req
                .on('data', (chunk) => { body.push(chunk) })
                .on('end', () => {
                  req.body = Buffer.concat(body).toString()
                  this._handleMessage(req, resp)
                })
                .on('error', (err) => { // If we don't listen to this it will crash https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
                  debug('Error on http request %j', err)
                })
    }

    this._eventServer = http.createServer(this._requestHandler)
  }

  startListener (options = {}) {
    debug('startListen %j', options)
    const defaults = {port: 4000, interface: 'public'}
    this._options = Object.assign({}, defaults, options)
    debug('startListen with defaults %j', this._options)
    if (!this._listening) {
      this._eventServer.listen(this._options.port)
      this._listening = true
    }
  }

  async stopListener () {
    return new Promise(async (resolve, reject) => {
      if (this._listening) {
        this._eventServer.close()
                // TODO cancel all subscriptions
        this._listening = false
      }
    })
  }

  async subscribeTo (device) {

  }
}

class DeviceSubscription {

  constructor (device, listenAddress) {
    this.subscriptions = []
    this.device = device
    this.listenAddress = listenAddress || ip.address('public')
  }

  async addSubscription (endpoint) {
    return new Promise((resolve, reject) => {
      let opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + endpoint,
        method: 'SUBSCRIBE',
        headers: {
          callback: '<http://' + this.listenAddress + ':' + this.port + '/notify>',
          NT: 'upnp:event',
          Timeout: 'Second-3600'
        },
        resolveWithFullResponse: true
      }
      request(opt)
        .then(resp => {
            let sid = resp.headers.sid
            this.subscriptions[sid] = {endpoint: endpoint, renew_at: this.headerToDateTime(resp.headers.timeout)}
            resolve(sid)
        })
        .catch(reject)
    })
  }

  async renewSubscription (sid) {
    return new Promise((resolve, reject) => {
      const subscription = this.subscriptions[sid]
      let opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + subscription.endpoint,
        method: 'SUBSCRIBE',
        headers: {
          SID: sid,
          Timeout: 'Second-3600'
        },
        resolveWithFullResponse: true
      }
      request(opt)
        .then(resp => {
            debug('Renew %s success', sid)
            this.subscriptions[sid].renew_at = this.headerToDateTime(resp.headers.timeout)
            resolve(sid)
        })
        .catch(err => {
            debug('Renew %s failed %j', sid, err)
            delete this.subscriptions[sid]
            this.addSubscription(subscription.endpoint)
                .then(resolve)
                .catch(reject)
        })
    })
  }

  hasSubscription (sid) {
    return (this.subscriptions[sid] !== undefined)
  }

  handleNotification (sid, body) {
        // TODO Handle the notification like in https://github.com/thkl/node-sonos/tree/master/lib/events or something
  }

  async cancelAllSubscriptions () {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(this.subscriptions)
      keys.forEach((key) => {
        cancelSubscription(key)
      })
      resolve(true)
    })
  }

  async cancelSubscription (sid) {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://' + this.device.host + ':' + this.device.port + this.subscriptions[sid].endpoint,
        method: 'UNSUBSCRIBE',
        headers: {
          sid: sid
        }
      })
                .then(result => {
                  delete this.subscriptions[sid]
                })
                .then(resolve)
                .catch(reject)
    })
  }

  headerToDateTime (timeout) {
    var seconds

    if ((!!timeout) && (timeout.indexOf('Second-') === 0)) timeout = timeout.substr(7)
    seconds = (((!!timeout) && (!isNaN(timeout))) ? parseInt(timeout, 10) : 3600) - 15
    if (seconds < 0) seconds = 15; else if (seconds > 1200) seconds = 1200

    return (new Date().getTime() + (seconds * 1000))
  }

}

export let listener = new SonosListener()
