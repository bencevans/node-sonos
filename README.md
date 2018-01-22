<h1 align="center">
  <br>
  <a href="https://github.com/bencevans/node-sonos"><img src="https://cdn.rawgit.com/bencevans/node-sonos/0f2775ab/logo.svg" alt="node-sonos logo" width="200"></a>
  <br>
  <br/>
  node-sonos
  <br>
  <br>
</h1>

<p align="center">
  <b>Control your Sonos devices with JavaScript (node.js)</b>
</p>

<p align="center">
  <a href="https://travis-ci.org/bencevans/node-sonos">
    <img src="http://img.shields.io/travis/bencevans/node-sonos/master.svg?style=flat-square"
         alt="Travis Build">
  </a>
  <a href="https://www.npmjs.com/package/sonos">
    <img src="https://img.shields.io/npm/v/sonos.svg?style=flat-square"
         alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/sonos">
    <img src="https://img.shields.io/npm/dm/sonos.svg?style=flat-square"
         alt="NPM Downloads">
  </a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
         alt="Standard Codestyle">
  </a>
</p>

**node-sonos** gives you the power to control all your Sonos devices from your own apps in JavaScript. Automatically discover your devices on the network and control the playback and queue with instant events announcing change.

## Features

* Device Discovery
* Queue Control
* Volume Control
* Spotify Support
* Radio
* Change Events

## Install

Published versions (reccomended)

    $ npm install sonos

From the repo, living on the edge

    $ npm install git://github.com/bencevans/node-sonos.git

## Quick Start

### Discovering Devices

```js
const { search } = require('sonos')

// event on all found...
search((device) => {
  console.log('found device at ' + device.host)

  // mute every device...
  device.setMuted(true)
    .then(`${device.host} now muted`)
})

// find one device
search().once('DeviceAvailable', (device) => {
  console.log('found device at ' + device.host)

  // get topology
  device.getTopology()
    .then(console.log)
})
```


### Controlling Known Devices

```js
const { Sonos } = require('sonos')

const device = new Sonos('192.168.1.56');

device.play()
  .then(() => console.log('now playing'))

device.getVolume()
  .then((volume) => console.log(`current volume = ${volume}`))
```

## API

For detailed info read the [/API.md](https://github.com/bencevans/node-sonos/blob/master/API.md) file, else…

* search([options], [deviceAvailableListener])
* Class: Search([options])
  * Event: 'DeviceAvailable'
  * destroy()
* Class: Sonos(host, [port])
  * currentTrack()
  * deviceDescription()
  * flush()
  * getCurrentState()
  * getLEDState()
  * getMusicLibrary(search, options)
  * getMuted()
  * getTopology()
  * getVolume()
  * getZoneAttrs()
  * getZoneInfo()
  * getQueue()
  * next()
  * parseDIDL(didl)
  * pause()
  * play(uri)
  * previous()
  * queue(uri, positionInQueue)
  * queueNext(uri)
  * request(endpoint, action, body, responseTag)
  * seek(seconds)
  * setLEDState(desiredState)
  * setMuted(muted)
  * setName(name)
  * getPlayMode()
  * setPlayMode(mode)
  * setVolume(volume)
  * stop()
  * setSpotifyRegion(region)
  * alarmClockService()
    * ListAlarms()
    * PatchAlarm(id,options)
    * SetAlarm(id,enabled)
  * joinGroup(otherDeviceName)
  * leaveGroup()
  * startListening(options)
  * stopListening()
  * Event: 'TrackChanged'
  * Event: 'VolumeChanged'
  * Event: 'StateChanged'
  * Event: 'Muted'

## In The Wild

node-sonos in use across the interwebs. Missing yours? [Add it](https://github.com/bencevans/node-sonos/edit/master/README.md) and send us a pull request!

### Apps

* **[AirSonos](https://github.com/stephen/airsonos)** - Apple AirPlay (iOS, OS X) support to all Sonos devices on a network.
* **[sonos-cli](https://github.com/bencevans/sonos-cli)** - Command Line Interface for Sonos
* **[sonos2mqtt](https://github.com/svrooij/sonos2mqtt)** - Bridge between Sonos and an MQTT server
* **[homebridge-zp](https://github.com/ebaauw/homebridge-zp)** - Homebridge plugin for Sonos ZonePlayer

### Writeups

* **[How we gave our studio WWE-style entrances using iBeacons and Sonos](https://hackernoon.com/how-we-gave-our-studio-wwe-style-entrances-using-ibeacons-and-sonos-92dd2f54983)** - A technical run-down of using futuristic technology for sheer entertainment value

## Examples

Additional examples can be found in the [/examples](https://github.com/bencevans/node-sonos/tree/master/examples) directory within the repository.

## Maintainers

* Ben Evans (@bencevans)
* Stephen Wan (@stephen)
* Marshall T. Rose (@mrose17)
* Stephan van Rooij (@svrooij)

And a big thanks to all you other [contributors](https://github.com/bencevans/node-sonos/graphs/contributors)! Pull-requests are beautiful things.

## Licence

MIT © [Ben Evans](https://bencevans.io)