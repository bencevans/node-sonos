
Sonos = require "../"
sonos = new Sonos.Sonos "192.168.2.11"

sonos.next (err, nexted) ->
  unless err or not nexted
    console.log "Complete"
  else
    console.log "OOOHHHHHH NOOOO"