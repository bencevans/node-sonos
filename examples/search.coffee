
Sonos = require "../"

search = Sonos.search()

search.on "DeviceAvailable", (device) ->
  console.log device