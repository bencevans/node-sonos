var Sonos = require('../index').Sonos;
var Listener = require('../lib/events/listener');

var x = new Listener(new Sonos(process.env.SONOS_HOST || '192.168.2.11'));
x.listen(function(err) {
  if (err) throw err;
  
  x.addService('/ZoneGroupTopology/Event', function(error, sid) {
    if (error) throw err;
    console.log('Successfully subscribed, with subscription id', sid);
  });

  x.on('serviceEvent', function(endpoint, sid, data) {
    console.log('Received event from', endpoint, '(' + sid + ') with data:', data, '\n\n');
  });
});