# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v0.19.0

* Friendly event listening - [#195](https://github.com/bencevans/node-sonos/pull/195) [@svrooij](https://github.com/svrooij)
* Updated deps mocha@4.1.0 xml2js@0.4.19 request@2.83.0 ip@1.1.5 debug@3.1.0
* Dropped support for node v4

## v0.18.0

* Added queuePosition to currentTrack() response - [#191](https://github.com/bencevans/node-sonos/pull/191) [@sammygriffiths](https://github.com/sammygriffiths)
* Fixed a missing options param in searchLibrary example - [#189](https://github.com/bencevans/node-sonos/pull/189) [@gupsho](https://github.com/gupsho)

## v0.17.0

* Fixed issues encoding URIs - [#185](https://github.com/bencevans/node-sonos/issues/185) [#188](https://github.com/bencevans/node-sonos/pull/188) [@gupsho](https://github.com/gupsho)
* Added .getPlayMode - [#183](https://github.com/bencevans/node-sonos/pull/184) [#184](https://github.com/bencevans/node-sonos/pull/184) [@bencevans](https://github.com/bencevans)

## v0.16.0

* Added GetMute and SetMute on RenderingControl Service - [#181](https://github.com/bencevans/node-sonos/pull/181) [@welteki](https://github.com/welteki)
* Added sonos.getFavorites - [#178](https://github.com/bencevans/node-sonos/pull/178) [@gupsho](https://github.com/gupsho)

## Previous

### Fixed
* encoding: Fix encoding failues on objects containing a 'length' key (thanks to [connor4312](https://github.com/connor4312))

### Added
* TypeScript definitions (thanks to [SPARTAN563](https://github.com/SPARTAN563))
* Support for configuring the client by providing a url to locate InfluxDB (thanks to [mmalecki](https://github.com/mmalecki))
* CONTRIBUTING.md describing guidelines for contributing to the project



