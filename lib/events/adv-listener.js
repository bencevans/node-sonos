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
const ParseAndEmitEvents = require('./eventParser').ParseAndEmitEvents

const listenAddress = process.env.SONOS_LISTENER || ip.address('public')

const globalEventEndpoints = [
  '/AlarmClock/Event',
  '/ZoneGroupTopology/Event'
]
const deviceEventEndpoints = [
  '/MediaRenderer/AVTransport/Event',
  '/MediaRenderer/RenderingControl/Event',
  '/MediaRenderer/GroupRenderingControl/Event',
  '/MediaRenderer/Queue/Event'
]

/**
 * An event listener for sonos events. (Just a small http server)
 * @class SonosListener
 */
class SonosListener extends EventEmitter {
  /**
   * Creates a new SonosListener (called automatically)
   */
  constructor () {
    super()
    this.port = parseInt(process.env.SONOS_LISTENER_PORT || 4000)
    this._listening = false
    this._deviceSubscriptions = []

    this._requestHandler = function (req, resp) {
      let body = []
      req
        .on('data', (chunk) => { body.push(chunk) })
        .on('end', () => {
          const bodyString = Buffer.concat(body).toString()
          defaultListener._handleMessage(req, resp, bodyString)
        })
        .on('error', (err) => { // If we don't listen to this it will crash https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
          debug('Error on http request %j', err)
        })
    }

    this._eventServer = http.createServer(this._requestHandler)
  }

  /**
   * Start the listener, has to be called before subscribing
   */
  startListener () {
    if (!this._listening) {
      debug('startListen %d', this.port)
      this._eventServer.listen(this.port)
      this._listening = true
    }
  }

  /**
   * Stop the listener and unsubscribes for all events.
   * Very important to call or you'll get wrong notifications
   */
  async stopListener () {
    if (this._listening) {
      this._eventServer.close()
      this._listening = false

      let cancel = function (s) {
        return s.cancelAllSubscriptions()
      }
      var cancelAll = this._deviceSubscriptions.map(cancel)
      return Promise.all(cancelAll)
    } else {
      return new Promise((resolve, reject) => { reject(new Error('Not listening')) })
    }
  }

  isListening () {
    return this._listening
  }

  /**
   * Subscribe to all events for this device.
   * @param {Sonos} device Pass in the Sonos device, it will be the eventemitter
   */
  async subscribeTo (device) {
    return new Promise((resolve, reject) => {
      this.startListener()
      if (device._isSubscribed) {
        debug('Already subscribed to this device')
        resolve(true)
        return
      }
      device._isSubscribed = true // This should be improved but it works for now.
      let sub = new DeviceSubscription(device)
      let add = function (endpoint) {
        return sub.addSubscription(endpoint)
      }
      if (this._deviceSubscriptions.length === 0) {
        let addAll = globalEventEndpoints.concat(deviceEventEndpoints).map(add)
        Promise.all(addAll)
          .then(result => {
            this._deviceSubscriptions.push(sub)
          }).then(resolve).catch(reject)
      } else {
        let addDevice = deviceEventEndpoints.map(add)
        Promise.all(addDevice)
          .then(result => {
            this._deviceSubscriptions.push(sub)
          }).then(resolve).catch(reject)
      }
    })
  }

  _handleMessage (req, resp, body) {
    const { method, headers, url } = req
    let self = this

    if (method.toUpperCase() !== 'NOTIFY' || url.toLowerCase() !== '/notify') {
      debug('Unknown request %s %s %j %s', method, url, headers, body)
      resp.statuscode = 404
      resp.end('404 - Not found')
    } else {
      // Find the subscription matching this sid
      let deviceSubscription = this._deviceSubscriptions.find((el, index, arr) => {
        return el.hasSubscription(headers.sid)
      })

      // If the device subscription isnt't found, we have to return an error
      if (!deviceSubscription) {
        debug('Request received for unknown subscription %s', headers.sid)
        // This will stop these requests from coming.
        resp.statuscode = 404
        resp.end('404 - Not found')
      } else {
        parseXml(body)
          .then(parsedBody => {
            let endpoint = deviceSubscription.subscriptions[headers.sid].endpoint
            let eventBody = parsedBody['e:propertyset']['e:property']
            if (deviceEventEndpoints.indexOf(endpoint) > -1) {
              // Send the parsed body to the device subscription
              deviceSubscription.handleNotification(endpoint, eventBody)
            } else {
              self._handleGlobalNotification(endpoint, eventBody)
            }
            resp.statuscode = 200
            resp.end('OK')
          })
          .catch(err => {
            debug('Error parsing the body %j', err)
            resp.statuscode = 500
            resp.end('500 - Error parsing body')
          })
      }
    }
  }

  async _handleGlobalNotification (endpoint, body) {
    debug('Global notification %s %j', endpoint, body)
    let sonosEvent = await ParseAndEmitEvents(endpoint, body, this._deviceSubscriptions[0].device)
    if (sonosEvent.name === 'ZoneGroupTopology') {
      this.emit('ZonesChanged', sonosEvent.eventBody.Zones)
      delete sonosEvent.eventBody.Zones
    }
    this.emit(sonosEvent.name || 'UnknownEvent', sonosEvent)
  }
}
// Initialize the listener and export it. (Single instance https://k94n.com/es6-modules-single-instance-pattern)
let defaultListener = new SonosListener()

module.exports = defaultListener

/**
 * DeviceSubscription, used internally to keep record of subscriptions
 * @class DeviceSubscription
 */
class DeviceSubscription {
/**
 * Create new subscription
 * @param {Sonos} device Pass in the sonos device
 */
  constructor (device) {
    this.subscriptions = []
    this.device = device
  }

  /**
   * Subscribe to specefic endpoint for this device
   * @param {String} endpoint What endpoint do we need to subscribe to?
   */
  async addSubscription (endpoint) {
    let opt = {
      url: 'http://' + this.device.host + ':' + this.device.port + endpoint,
      method: 'SUBSCRIBE',
      headers: {
        callback: '<http://' + listenAddress + ':' + defaultListener.port + '/notify>',
        NT: 'upnp:event',
        Timeout: 'Second-1800'
      },
      resolveWithFullResponse: true
    }
    return request(opt)
      .then(resp => {
        let sid = resp.headers.sid
        debug('Got %s for %s', sid, endpoint)
        this._startTimer()
        this.subscriptions[sid] = { endpoint: endpoint, renew_at: this.headerToDateTime(resp.headers.timeout) }
        return sid
      })
  }

  /**
   * Use this function to start the renew timer
   */
  _startTimer () {
    if (this._renewTimer) clearInterval(this._renewTimer)
    let self = this
    this._renewTimer = setInterval(async () => {
      try {
        await self.renewAllSubscriptions()
      } catch (err) {
        debug('Timer error renewing subscriptions %j', err)
        if (err.cause && err.cause.code === 'EHOSTUNREACH') {
          debug('Continue renewing subscription')
        } else {
          debug('Stop renewing subscription')
          clearInterval(self._renewTimer)
        }
      }
    }, 25 * 60 * 1000) // 25 min
  }

  /**
   * Renew all subscriptions for this device
   */
  async renewAllSubscriptions () {
    let self = this
    let renew = function (sid) {
      return self.renewSubscription(sid)
    }
    let renewAll = Object.keys(this.subscriptions).map(renew)
    return Promise.all(renewAll)
  }

  /**
   * Renew a single subscription
   * @param {String} sid Subscription id you want to renew
   */
  async renewSubscription (sid) {
    return new Promise((resolve, reject) => {
      const subscription = this.subscriptions[sid]
      let opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + subscription.endpoint,
        method: 'SUBSCRIBE',
        headers: {
          SID: sid,
          Timeout: 'Second-1800'
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

  /**
   * Does this deivce have a subscription with a specific sid
   * @param {String} sid Subscription id
   */
  hasSubscription (sid) {
    return (this.subscriptions[sid] !== undefined)
  }

  /**
   * This will be called by the SonosListener for device specific devices
   * @param {String} endpoint The endpoint used for the subscription
   * @param {String} body The body of the event
   */
  async handleNotification (endpoint, body) {
    // debug('Incoming message on %s %s %j', this.device.host, endpoint, body)
    let sonosEvent = await ParseAndEmitEvents(endpoint, body, this.device)
    debug('Sonos event %s', JSON.stringify(sonosEvent, null, 2))
    // TODO Handle the notification like in https://github.com/thkl/node-sonos/tree/master/lib/events or something
  }

  /**
   * Cancel all the subscriptions for this device. Important to stop the notifications from returing.
   */
  async cancelAllSubscriptions () {
    let self = this
    let cancel = function (s) {
      return self.cancelSubscription(s)
    }
    let cancelAll = Object.keys(this.subscriptions).map(cancel)
    return Promise.all(cancelAll)
  }

  /**
   * Cancel a single subscribtion
   * @param {String} sid Subscription id
   */
  async cancelSubscription (sid) {
    return request({
      url: 'http://' + this.device.host + ':' + this.device.port + this.subscriptions[sid].endpoint,
      method: 'UNSUBSCRIBE',
      headers: {
        sid: sid
      }
    }).then(result => {
      debug('Cancelled subscription %s for %s', sid, this.device.host)
      delete this.subscriptions[sid]
    })
  }

  /**
   * Convert the Timeout header to datetime (legacy code...)
   * @param {String} timeout TimeOut header
   */
  headerToDateTime (timeout) {
    var seconds

    if ((!!timeout) && (timeout.indexOf('Second-') === 0)) timeout = timeout.substr(7)
    seconds = (((!!timeout) && (!isNaN(timeout))) ? parseInt(timeout, 10) : 3600) - 15
    if (seconds < 0) seconds = 15; else if (seconds > 1200) seconds = 1200

    return (new Date().getTime() + (seconds * 1000))
  }
}
