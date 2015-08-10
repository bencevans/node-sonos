var Sonos = require('../');
var keypress = require('keypress');

Sonos.LogicalDevice.search(function(err, groups) {
  console.log(err, groups);
});

var dev = new Sonos.LogicalDevice([
  { host: '172.17.106.196', port: 1400 },
  { host: '172.17.107.66', port: 1400 }
]);

dev.initialize(function() {
  console.log('use up / down keys to change volume');

  keypress(process.stdin);

  process.stdin.on('keypress', function (ch, key) {
    if (key.name === 'down') {

      dev.getVolume(function(vol) {
        dev.setVolume(vol - 5);
      });

    } else if (key.name === 'up') {

      dev.getVolume(function(vol) {
        dev.setVolume(vol + 5);
      });

    }
    if (key && key.ctrl && key.name === 'c') {
      process.exit();
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

});
