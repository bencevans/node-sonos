const debug = require('debug')('sonos-group')
const URL = require('url').URL

class SonosGroup {
  constructor (zoneGroup) {
    debug('ZoneGroup %j', zoneGroup)
    /**
     * @type {string}
     */
    this.CoordinatorID = zoneGroup.Coordinator
    /**
     * @type {Array<{ host: string, port: number | string, name: string}>}
     */
    this.Members = []
    if (!Array.isArray(zoneGroup.ZoneGroupMember)) {
      zoneGroup.ZoneGroupMember = [zoneGroup.ZoneGroupMember]
    }
    zoneGroup.ZoneGroupMember.forEach(device => {
      const url = new URL(device.Location)
      // TODO I want the members to be a Sonos device for direct control but cannot do that yet.
      // Need help with not creating a circular refference.
      this.Members.push({ host: url.hostname, port: url.port, name: device.ZoneName })
    })
    const coordinator = zoneGroup.ZoneGroupMember.find((device) => { return device.UUID === zoneGroup.Coordinator })
    if (coordinator) {
      this.Name = coordinator.ZoneName
      const url = new URL(coordinator.Location)
      this.Coordinator = { host: url.hostname, port: url.port }
    } else {
      this.Name = this.Members.length > 0 ? this.Members[0].name : ''
    }
    if (this.Members.length > 1) this.Name += ' + ' + (this.Members.length - 1).toString()
  }
}
module.exports = SonosGroup
