var GroupRenderingControl = function (host, port) {
  this.name = 'GroupRenderingControl'
  this.host = host
  this.port = port || 1400
  this.controlURL = '/MediaRenderer/GroupRenderingControl/Control'
  this.eventSubURL = '/MediaRenderer/GroupRenderingControl/Event'
  this.SCPDURL = '/xml/GroupRenderingControl1.xml'
}

require('util').inherits(GroupRenderingControl, require('./Service'))

module.exports = GroupRenderingControl
