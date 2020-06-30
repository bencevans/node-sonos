/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 */

const Service = require('./Service')

/**
 * Create a new instance of AlarmClock
 * @class AlarmClock
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class GroupRenderingControl extends Service {
  constructor (host, port) {
    super()
    this.name = 'GroupRenderingControl'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaRenderer/GroupRenderingControl/Control'
    this.eventSubURL = '/MediaRenderer/GroupRenderingControl/Event'
    this.SCPDURL = '/xml/GroupRenderingControl1.xml'
  }

  async GetGroupMute () {
    return this._request('GetGroupMute', { InstanceID: 0 }).then((r) =>
      Boolean(Number(r.CurrentMute))
    )
  }

  async SetGroupMute (DesiredMute) {
    return this._request('SetGroupMute', { InstanceID: 0, DesiredMute })
  }

  async GetGroupVolume () {
    return this._request('GetGroupVolume', { InstanceID: 0 }).then((r) =>
      Number(r.CurrentVolume)
    )
  }

  async SetGroupVolume (DesiredVolume) {
    return this._request('SetGroupVolume', {
      InstanceID: 0,
      DesiredVolume
    })
  }

  async SetRelativeGroupVolume (Adjustment) {
    return this._request('SetRelativeGroupVolume', {
      InstanceID: 0,
      Adjustment
    }).then((r) => Number(r.NewVolume))
  }

  async SnapshotGroupVolume () {
    return this._request('SnapshotGroupVolume', {
      InstanceID: 0
    })
  }
}

module.exports = GroupRenderingControl
