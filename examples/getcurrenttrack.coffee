
Sonos = require "../"

sonos = new Sonos.Sonos process.env.SONOS_HOST or "192.168.2.11", process.env.SONOS_PORT or 1400

sonos.currentTrack (err, track) ->
  console.log err, track