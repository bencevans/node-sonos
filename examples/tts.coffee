
webhost = "192.168.2.25"

text = "Yo, play some sweet music, Not This!"

Sonos = require "../"

sonos = new Sonos.Sonos "192.168.2.14"

sonos.queueNext "http://translate.google.com/translate_tts?q=#{text}&tl=en.mp3", (err, playing) ->
  console.log {err, playing}