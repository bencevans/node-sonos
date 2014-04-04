
var ContentDirectory = function(host, port) {
  this.name = 'ContentDirectory';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaServer/ContentDirectory/Control';
  this.eventSubURL = '/MediaServer/ContentDirectory/Event';
  this.SCPDURL = '/xml/ContentDirectory1.xml';
};

require('util').inherits(ContentDirectory, require('./Service'));

ContentDirectory.prototype.Browse = function(options, callback) { this._request('Browse', options, callback); };

module.exports = ContentDirectory;