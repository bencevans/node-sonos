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
  <a href="https://github.com/bencevans/node-sonos/actions">
    <img src="https://img.shields.io/github/workflow/status/bencevans/node-sonos/Run%20tests/master?style=flat-square&color=brightgreen"
         alt="GitHub Actions Build">
  </a>
  <a href="https://www.npmjs.com/package/sonos">
    <img src="https://img.shields.io/npm/v/sonos.svg?style=flat-square"
         alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/sonos">
    <img src="https://img.shields.io/npm/dm/sonos.svg?style=flat-square&color=brightgreen"
         alt="NPM Downloads">
  </a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
         alt="Standard Codestyle">
  </a>
  <a href="https://discord.gg/m62rFAV4NU">
  <img src="https://img.shields.io/discord/782374564054564875?style=flat-square&color=success" alt="Discord badge" />
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

Published versions (recommended)

    $ npm install sonos

From the repo, living on the edge

    $ npm install git://github.com/bencevans/node-sonos.git

## Quick Start

### Discovering Devices

```js
const { DeviceDiscovery } = require('sonos')

// event on all found...
DeviceDiscovery((device) => {
  console.log('found device at ' + device.host)

  // mute every device...
  device.setMuted(true)
    .then(d => console.log(`${device.host} now muted`))
})

// find one device
DeviceDiscovery().once('DeviceAvailable', (device) => {
  console.log('found device at ' + device.host)

  // get all groups
  device.getAllGroups().then(groups => {
    groups.forEach(group => {
      console.log(group.Name);
    })
  })
})
```

### Discovering devices async

```js
const DeviceDiscovery = require('sonos').AsyncDeviceDiscovery
let discovery = new DeviceDiscovery()
discovery.discover().then((device, model) => {
    // Do stuff, see examples/devicediscovery.js
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

* DeviceDiscovery([options], [deviceAvailableListener])
* Class: DeviceDiscovery([options])
  * Event: 'DeviceAvailable'
  * destroy()
* Class: 'AsyncDeviceDiscovery'
  * discover([options])
  * discoverMultiple([options])
* Class: Sonos(host, [port])
  * currentTrack()
  * deviceDescription()
  * flush()
  * getCurrentState()
  * getLEDState()
  * getMusicLibrary(search, options)
  * getMuted()
  * ~~getTopology()~~ Doesn't work if you upgraded to Sonos v9.1. Check-out getAllGroups() for some replacement.
  * getVolume()
  * getZoneAttrs()
  * getZoneInfo()
  * getQueue()
  * next()
  * parseDIDL(didl)
  * pause()
  * play(uri)
  * togglePlayback()
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
  * getAllGroups()
  * startListening(options)
  * stopListening()
  * Event: 'CurrentTrack'
  * Event: 'NextTrack'
  * Event: 'PlayState' and 'PlaybackStopped'
  * Event: 'AVTransport'
  * Event: 'Volume'
  * Event: 'Muted'
  * Event: 'RenderingControl'

## Documentation

We tried to add jsdoc info to all functions, and generate documentation from it. [/docs](./docs/)

## Examples

Additional examples can be found in the [/examples](./examples) directory within the repository.

## In The Wild

node-sonos in use across the interwebs. Missing yours? [Add it](https://github.com/bencevans/node-sonos/edit/master/README.md) and send us a pull request!

### Apps

* **[AirSonos](https://github.com/stephen/airsonos)** - Apple AirPlay (iOS, OS X) support to all Sonos devices on a network.
* **[sonos-cli](https://github.com/bencevans/sonos-cli)** - Command Line Interface for Sonos
* **[sonos2mqtt](https://github.com/svrooij/sonos2mqtt)** - Bridge between Sonos and an MQTT server
* **[homebridge-zp](https://github.com/ebaauw/homebridge-zp)** - Homebridge plugin for Sonos ZonePlayer
* **[ZenMusic](https://github.com/htilly/zenmusic)** - Control Sonos thru #Slack!
* **[gladys-sonos](https://github.com/GladysProject/gladys-sonos)** - Control Sonos with [Gladys](https://github.com/GladysProject/Gladys) a Raspberry Pi Home Assistant
* **[sonos-web](https://github.com/Villarrealized/sonos-web)** - Sonos controller for your web browser
* **[BudgieStream](https://github.com/filahf/budgie-stream)** - Stream system output to Sonos

### Writeups

* **[How we gave our studio WWE-style entrances using iBeacons and Sonos](https://hackernoon.com/how-we-gave-our-studio-wwe-style-entrances-using-ibeacons-and-sonos-92dd2f54983)** - A technical run-down of using futuristic technology for sheer entertainment value

## Maintainers

* Ben Evans (@bencevans)
* Stephen Wan (@stephen)
* Marshall T. Rose (@mrose17)
* Stephan van Rooij (@svrooij)

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-51-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://bencevans.io/"><img src="https://avatars1.githubusercontent.com/u/638535?v=4" width="120px;" alt=""/><br /><sub><b>Ben Evans</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=bencevans" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/commits?author=bencevans" title="Documentation">📖</a> <a href="#ideas-bencevans" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-bencevans" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://svrooij.io"><img src="https://avatars2.githubusercontent.com/u/1292510?v=4" width="120px;" alt=""/><br /><sub><b>Stephan van Rooij</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=svrooij" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/commits?author=svrooij" title="Documentation">📖</a> <a href="https://github.com/bencevans/node-sonos/pulls?q=is%3Apr+reviewed-by%3Asvrooij" title="Reviewed Pull Requests">👀</a> <a href="#maintenance-svrooij" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/sseiber"><img src="https://avatars0.githubusercontent.com/u/618603?v=4" width="120px;" alt=""/><br /><sub><b>Scott Seiber</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=sseiber" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/commits?author=sseiber" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/mrose17"><img src="https://avatars1.githubusercontent.com/u/400552?v=4" width="120px;" alt=""/><br /><sub><b>Marshall T. Rose</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=mrose17" title="Code">💻</a> <a href="#maintenance-mrose17" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://stephenwan.com"><img src="https://avatars0.githubusercontent.com/u/2320890?v=4" width="120px;" alt=""/><br /><sub><b>Stephen Wan</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=stephen" title="Code">💻</a> <a href="#maintenance-stephen" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/pascalopitz"><img src="https://avatars1.githubusercontent.com/u/271740?v=4" width="120px;" alt=""/><br /><sub><b>Pascal Opitz</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=pascalopitz" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/gupsho"><img src="https://avatars1.githubusercontent.com/u/1124090?v=4" width="120px;" alt=""/><br /><sub><b>Shobhit Gupta</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=gupsho" title="Code">💻</a></td>
    <td align="center"><a href="https://humanoids.be"><img src="https://avatars0.githubusercontent.com/u/640949?v=4" width="120px;" alt=""/><br /><sub><b>Martin Giger</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=freaktechnik" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/issues?q=author%3Afreaktechnik" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/HarlekinX"><img src="https://avatars3.githubusercontent.com/u/3353981?v=4" width="120px;" alt=""/><br /><sub><b>Matthias Brünning</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=HarlekinX" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ebaauw"><img src="https://avatars0.githubusercontent.com/u/22179355?v=4" width="120px;" alt=""/><br /><sub><b>Erik Baauw</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=ebaauw" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/issues?q=author%3Aebaauw" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/ThomasMirlacher"><img src="https://avatars3.githubusercontent.com/u/36892916?v=4" width="120px;" alt=""/><br /><sub><b>Thomas Mirlacher</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=ThomasMirlacher" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tobhult"><img src="https://avatars2.githubusercontent.com/u/22472772?v=4" width="120px;" alt=""/><br /><sub><b>Tobias Hultman</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=tobhult" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/monsur"><img src="https://avatars2.githubusercontent.com/u/81861?v=4" width="120px;" alt=""/><br /><sub><b>Monsur Hossain</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=monsur" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/TheBenji"><img src="https://avatars1.githubusercontent.com/u/1070666?v=4" width="120px;" alt=""/><br /><sub><b>Ben A.</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=TheBenji" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/phoenixrising87"><img src="https://avatars3.githubusercontent.com/u/28021533?v=4" width="120px;" alt=""/><br /><sub><b>Manuel Heim</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=phoenixrising87" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ludlovian"><img src="https://avatars2.githubusercontent.com/u/30529803?v=4" width="120px;" alt=""/><br /><sub><b>Alan Layng</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=ludlovian" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/issues?q=author%3Aludlovian" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://omines.nl"><img src="https://avatars0.githubusercontent.com/u/1455673?v=4" width="120px;" alt=""/><br /><sub><b>Niels Keurentjes</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=curry684" title="Code">💻</a></td>
    <td align="center"><a href="http://www.dafruits.com"><img src="https://avatars3.githubusercontent.com/u/53433?v=4" width="120px;" alt=""/><br /><sub><b>Arnaud Vallat</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=rno" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/cw124"><img src="https://avatars2.githubusercontent.com/u/7177848?v=4" width="120px;" alt=""/><br /><sub><b>Chris Wiggins</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=cw124" title="Code">💻</a></td>
    <td align="center"><a href="http://dennis.io"><img src="https://avatars3.githubusercontent.com/u/332905?v=4" width="120px;" alt=""/><br /><sub><b>Dennis</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=ds82" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/htilly"><img src="https://avatars0.githubusercontent.com/u/582460?v=4" width="120px;" alt=""/><br /><sub><b>Henrik Tilly</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=htilly" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/issues?q=author%3Ahtilly" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://iansutherland.ca/"><img src="https://avatars2.githubusercontent.com/u/433725?v=4" width="120px;" alt=""/><br /><sub><b>Ian Sutherland</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=iansu" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/driskell"><img src="https://avatars1.githubusercontent.com/u/939815?v=4" width="120px;" alt=""/><br /><sub><b>Jason Woods</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=driskell" title="Code">💻</a></td>
    <td align="center"><a href="https://fi.linkedin.com/in/harjulamarko"><img src="https://avatars1.githubusercontent.com/u/2276211?v=4" width="120px;" alt=""/><br /><sub><b>Marko Harjula</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=mharj" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/MikiDi"><img src="https://avatars0.githubusercontent.com/u/9383603?v=4" width="120px;" alt=""/><br /><sub><b>Michaël Dierick</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=MikiDi" title="Code">💻</a></td>
    <td align="center"><a href="https://blog.travismclarke.com"><img src="https://avatars1.githubusercontent.com/u/9957358?v=4" width="120px;" alt=""/><br /><sub><b>Travis Clarke</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=clarketm" title="Code">💻</a></td>
    <td align="center"><a href="http://vinkla.dev"><img src="https://avatars1.githubusercontent.com/u/499192?v=4" width="120px;" alt=""/><br /><sub><b>Vincent Klaiber</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=vinkla" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/VonRehberg"><img src="https://avatars3.githubusercontent.com/u/8611608?v=4" width="120px;" alt=""/><br /><sub><b>VonRehberg</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=VonRehberg" title="Code">💻</a></td>
    <td align="center"><a href="http://adamvarga.com"><img src="https://avatars0.githubusercontent.com/u/250306?v=4" width="120px;" alt=""/><br /><sub><b>Adam Varga</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=abv" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/arjenvanderende"><img src="https://avatars3.githubusercontent.com/u/357115?v=4" width="120px;" alt=""/><br /><sub><b>Arjen van der Ende</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=arjenvanderende" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.failsource.com"><img src="https://avatars3.githubusercontent.com/u/100601?v=4" width="120px;" alt=""/><br /><sub><b>Craig Lonsdale</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=craiglonsdale" title="Code">💻</a></td>
    <td align="center"><a href="https://craigmr.github.io"><img src="https://avatars3.githubusercontent.com/u/2215614?v=4" width="120px;" alt=""/><br /><sub><b>Craig Simpson</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=craigmr" title="Code">💻</a></td>
    <td align="center"><a href="https://denv.it/"><img src="https://avatars2.githubusercontent.com/u/4939519?v=4" width="120px;" alt=""/><br /><sub><b>Denys Vitali</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=denysvitali" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/erik-beus"><img src="https://avatars1.githubusercontent.com/u/32451595?v=4" width="120px;" alt=""/><br /><sub><b>Erik Beuschau</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=erik-beus" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hklages"><img src="https://avatars3.githubusercontent.com/u/17273119?v=4" width="120px;" alt=""/><br /><sub><b>H. Klages</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=hklages" title="Code">💻</a> <a href="https://github.com/bencevans/node-sonos/issues?q=author%3Ahklages" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://keith.mcknig.ht"><img src="https://avatars2.githubusercontent.com/u/1398194?v=4" width="120px;" alt=""/><br /><sub><b>Keith McKnight</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=kmck" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://kneths-korner.blogspot.com/"><img src="https://avatars0.githubusercontent.com/u/1225363?v=4" width="120px;" alt=""/><br /><sub><b>Kenneth Geisshirt</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=kneth" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/TKirmani"><img src="https://avatars0.githubusercontent.com/u/6881672?v=4" width="120px;" alt=""/><br /><sub><b>Kirmani</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=TKirmani" title="Code">💻</a></td>
    <td align="center"><a href="http://www.easen.co.uk"><img src="https://avatars0.githubusercontent.com/u/111948?v=4" width="120px;" alt=""/><br /><sub><b>Marc Easen</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=Easen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrstegeman"><img src="https://avatars3.githubusercontent.com/u/457381?v=4" width="120px;" alt=""/><br /><sub><b>Michael Stegeman</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=mrstegeman" title="Code">💻</a></td>
    <td align="center"><a href="http://www.findforsikring.dk"><img src="https://avatars2.githubusercontent.com/u/6514342?v=4" width="120px;" alt=""/><br /><sub><b>Morten Scheel</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=mortenscheel" title="Code">💻</a></td>
    <td align="center"><a href="http://nathanwong.co.uk"><img src="https://avatars2.githubusercontent.com/u/219826?v=4" width="120px;" alt=""/><br /><sub><b>Nathan Wong</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=esteluk" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://sam.daitzman.com"><img src="https://avatars2.githubusercontent.com/u/1499476?v=4" width="120px;" alt=""/><br /><sub><b>Sam Daitzman</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=sdaitzman" title="Code">💻</a></td>
    <td align="center"><a href="http://www.sammygriffiths.co.uk/"><img src="https://avatars3.githubusercontent.com/u/6638381?v=4" width="120px;" alt=""/><br /><sub><b>Sammy Griffiths</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=sammygriffiths" title="Code">💻</a></td>
    <td align="center"><a href="https://trevorsullivan.net"><img src="https://avatars3.githubusercontent.com/u/466713?v=4" width="120px;" alt=""/><br /><sub><b>Trevor Sullivan</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=pcgeek86" title="Code">💻</a></td>
    <td align="center"><a href="http://gambio.de"><img src="https://avatars1.githubusercontent.com/u/5122750?v=4" width="120px;" alt=""/><br /><sub><b>mistaTT</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=mistaTT" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/wafflegolfing"><img src="https://avatars0.githubusercontent.com/u/6316612?v=4" width="120px;" alt=""/><br /><sub><b>wafflegolfing</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=wafflegolfing" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yoogie"><img src="https://avatars0.githubusercontent.com/u/2392903?v=4" width="120px;" alt=""/><br /><sub><b>Björn Häggquist</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/commits?author=yoogie" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/wwwizzarrdry"><img src="https://avatars3.githubusercontent.com/u/2218144?v=4" width="120px;" alt=""/><br /><sub><b>wwwizzarrdry</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/issues?q=author%3Awwwizzarrdry" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/magnlund"><img src="https://avatars0.githubusercontent.com/u/34715101?v=4" width="120px;" alt=""/><br /><sub><b>Magnus Lundberg</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/issues?q=author%3Amagnlund" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.dandak.is/"><img src="https://avatars2.githubusercontent.com/u/7499386?v=4" width="120px;" alt=""/><br /><sub><b>Nick Dandakis</b></sub></a><br /><a href="https://github.com/bencevans/node-sonos/issues?q=author%3Anickdandakis" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
You can get added by [mentioning](https://allcontributors.org/docs/en/bot/usage)
the `@all-contributors` bot in a pr or issue.

If we missed you, just go to your (closed) issue or pr and mention the bot to get added.

## Issues

If you got discovered an issue with this library, please check the [issue-tracker](https://github.com/bencevans/node-sonos/issues).
And [create](https://github.com/bencevans/node-sonos/issues/new) an issue if your
problem isn't discovered by someone else.
If you want to contribute something check out these ['help-wanted' issues](https://github.com/bencevans/node-sonos/labels/help-wanted).

## Questions

[![Join us on Discord][badge_discord]][link_discord]

The best place to ask your questions is in Discord, we are there to help you. [Join us on Discord][link_discord].

### Unsupported sonos features

There is a great other library to control Sonos with Python, they also have a great list of all possible soap actions [here](https://github.com/SoCo/SoCo/wiki/Sonos-UPnP-Services-and-Functions). So if you have anything that you cannot do with node-sonos but that you can with the official app. You could have a look in the above list, or use [wireshark](https://github.com/SoCo/SoCo/wiki/Use-Wireshark-for-protocol-research) to investigate the protocol.

### NPM publish

We try to react to all pull-requests, but if you think we don't respond in time, please don't create a 'sonos-by-xyz' or a 'node-sonos-by-xyz' package on NPM. This might lead to people installing the wrong version.

If you want to publish your own version, please do it as a [user-scoped](https://docs.npmjs.com/getting-started/scoped-packages) eg. `@svrooij/sonos` package.

1. Change the top of the readme to state your specific changes.
2. Change the `name` of the project to `@npm_username/sonos`
3. Publish it to npm `npm publish --access=public`

## Development

If you want to make this library better, you can follow these steps.

1. Create a [fork](https://github.com/bencevans/node-sonos/fork)
2. Make changes
3. (optional) Create tests for the feature or the bug, see [sonos.test.js](./test/sonos.test.js).
4. Run `SONOS_HOST=192.168.x.x npm run test` to test your code (against an actual sonos device, change the ip)
5. Check-in your code in a single commit.
   Make sure your commit starts with `fix:` for a bugfix or `feat:` for a new
   feature followed by a short description. You can also follow with an
   empty line followed by a more details description.
6. Send a pull-request
7. Hold-on, we will be checking them.

If you already had a fork, make sure it is updated with the latest master so things don't get complicated when we want to merge the PR.

```bash
git remote add upstream https://github.com/bencevans/node-sonos.git
git fetch upstream
git checkout master
git rebase upstream/master
git push origin
```

## Licence

MIT © [Ben Evans](https://bencevans.io)

[badge_discord]: https://img.shields.io/discord/782374564054564875
[link_discord]: https://discord.gg/m62rFAV4NU
