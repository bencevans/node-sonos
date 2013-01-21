
var webhost = '192.168.2.25';
var text = 'Yo, play some sweet music, Not This!';

var Sonos = require('../');
var sonos = new Sonos.Sonos('192.168.2.14');

sonos.queueNext('http://translate.google.com/translate_tts?q=#{text}&tl=en.mp3', function(err, playing) {
  console.log([err, playing]);
});