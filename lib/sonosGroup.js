const debug = require('debug')('sonos-group')
const urlparser = require('url')
class SonosGroup {
  constructor (zoneGroup) {
    debug('ZoneGroup %j', zoneGroup)
    this.CoordinatorID = zoneGroup.Coordinator
    this.Members = []
    if (!Array.isArray(zoneGroup.ZoneGroupMember)) {
      zoneGroup.ZoneGroupMember = [zoneGroup.ZoneGroupMember]
    }
    zoneGroup.ZoneGroupMember.forEach(device => {
      let url = urlparser.parse(device.Location)
      // TODO I want the members to be a Sonos device for direct control but cannot do that yet.
      // Need help with not creating a circular refference.
      this.Members.push({ host: url.hostname, port: url.port, name: device.ZoneName })
    })
    const coordinator = zoneGroup.ZoneGroupMember.find((device) => { return device.UUID === zoneGroup.Coordinator })
    if (coordinator) {
      this.Name = coordinator.ZoneName
      let url = urlparser.parse(coordinator.Location)
      this.Coordinator = { host: url.hostname, port: url.port }
    } else {
      this.Name = this.Members.length > 0 ? this.Members.name : ''
    }
    if (this.Members.length > 1) this.Name += ' + ' + (this.Members.length - 1).toString()
  }
}
module.exports = SonosGroup
