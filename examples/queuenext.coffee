
Sonos = require "../"

sonos = new Sonos.Sonos "192.168.2.11"

sonos.queueNext "http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3", (err, playing) ->
  console.log {err, playing}