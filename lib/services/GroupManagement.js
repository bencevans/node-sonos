
var GroupManagement = function(host, port) {
  this.name = 'GroupManagement';
  this.host = host;
  this.port = port || 1400;
  this.controlURL = '/MediaRenderer/GroupManagement/Control';
  this.eventSubURL = '/MediaRenderer/GroupManagement/Event';
  this.SCPDURL = '/xml/GroupManagement1.xml';
};

require('util').inherits(GroupManagement, require('./Service'));

GroupManagement.prototype.AddMember = function(options, callback) { this._request('AddMember', options, callback); };
GroupManagement.prototype.RemoveMember = function(options, callback) { this._request('RemoveMember', options, callback); };
GroupManagement.prototype.ReportTrackBufferingResult = function(options, callback) { this._request('ReportTrackBufferingResult', options, callback); };

module.exports = GroupManagement;