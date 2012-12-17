
Sonos = require "../"

sonos = new Sonos.Sonos "192.168.2.11"

sonos.play (err, playing) ->
  console.log {err, playing}