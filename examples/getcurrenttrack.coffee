
Sonos = require "../"

sonos = new Sonos.Sonos "192.168.2.11", 1400

sonos.currentTrack (err, track) ->
  console.log err, track