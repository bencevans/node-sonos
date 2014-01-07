
var http = require('http');
var Sonos = require('../').Sonos;

var sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

var server = http.createServer(function(req, res) {
  sonos.currentTrack(function(err, track) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    var rows = [];

    for( var key in track) {
      if(key === 'albumArtURI')
        rows.push('<tr><th>' + key + '</th><td>' + track[key] + '</td></tr>');
    }


    res.write('<table>' + rows.join('') + '</table>');
    res.end();
  });
});

server.listen(process.env.PORT || 3000);