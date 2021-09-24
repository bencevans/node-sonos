const AlarmClockService = require('./alarm-clock.service')
const AudioInService = require('./audio-in.service')
const AVTransportService = require('./av-transport.service')
const ConnectionManagerService = require('./connection-manager.service')
const ContentDirectoryService = require('./content-directory.service')
const DevicePropertiesService = require('./device-properties.service')
const GroupManagementService = require('./group-management.service')
const GroupRenderingControlService = require('./group-rendering-control.service')
const HTControlService = require('./ht-control.service')
const MusicServicesService = require('./music-services.service')
const QPlayService = require('./q-play.service')
const QueueService = require('./queue.service')
const RenderingControlService = require('./rendering-control.service')
const SystemPropertiesService = require('./system-properties.service')
const VirtualLineInService = require('./virtual-line-in.service')
const ZoneGroupTopologyService = require('./zone-group-topology.service')

/**
 * Sonos AllServices
 *
 * A generated class to access all Sonos UPNP services.
 *
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @exports
 * @class AllServices
 */
class AllServices {
  constructor (host, port) {
    this.host = host
    this.port = port
  }

  /**
   * Get instance of AlarmClock service
   *
   * @returns AlarmClockService
   */
  AlarmClockService () {
    if (!this.alarmclockservice) {
      this.alarmclockservice = new AlarmClockService(this.host, this.port)
    }
    return this.alarmclockservice
  }

  /**
   * Get instance of AudioIn service
   *
   * @returns AudioInService
   */
  AudioInService () {
    if (!this.audioinservice) {
      this.audioinservice = new AudioInService(this.host, this.port)
    }
    return this.audioinservice
  }

  /**
   * Get instance of AVTransport service
   *
   * @returns AVTransportService
   */
  AVTransportService () {
    if (!this.avtransportservice) {
      this.avtransportservice = new AVTransportService(this.host, this.port)
    }
    return this.avtransportservice
  }

  /**
   * Get instance of ConnectionManager service
   *
   * @returns ConnectionManagerService
   */
  ConnectionManagerService () {
    if (!this.connectionmanagerservice) {
      this.connectionmanagerservice = new ConnectionManagerService(this.host, this.port)
    }
    return this.connectionmanagerservice
  }

  /**
   * Get instance of ContentDirectory service
   *
   * @returns ContentDirectoryService
   */
  ContentDirectoryService () {
    if (!this.contentdirectoryservice) {
      this.contentdirectoryservice = new ContentDirectoryService(this.host, this.port)
    }
    return this.contentdirectoryservice
  }

  /**
   * Get instance of DeviceProperties service
   *
   * @returns DevicePropertiesService
   */
  DevicePropertiesService () {
    if (!this.devicepropertiesservice) {
      this.devicepropertiesservice = new DevicePropertiesService(this.host, this.port)
    }
    return this.devicepropertiesservice
  }

  /**
   * Get instance of GroupManagement service
   *
   * @returns GroupManagementService
   */
  GroupManagementService () {
    if (!this.groupmanagementservice) {
      this.groupmanagementservice = new GroupManagementService(this.host, this.port)
    }
    return this.groupmanagementservice
  }

  /**
   * Get instance of GroupRenderingControl service
   *
   * @returns GroupRenderingControlService
   */
  GroupRenderingControlService () {
    if (!this.grouprenderingcontrolservice) {
      this.grouprenderingcontrolservice = new GroupRenderingControlService(this.host, this.port)
    }
    return this.grouprenderingcontrolservice
  }

  /**
   * Get instance of HTControl service
   *
   * @returns HTControlService
   */
  HTControlService () {
    if (!this.htcontrolservice) {
      this.htcontrolservice = new HTControlService(this.host, this.port)
    }
    return this.htcontrolservice
  }

  /**
   * Get instance of MusicServices service
   *
   * @returns MusicServicesService
   */
  MusicServicesService () {
    if (!this.musicservicesservice) {
      this.musicservicesservice = new MusicServicesService(this.host, this.port)
    }
    return this.musicservicesservice
  }

  /**
   * Get instance of QPlay service
   *
   * @returns QPlayService
   */
  QPlayService () {
    if (!this.qplayservice) {
      this.qplayservice = new QPlayService(this.host, this.port)
    }
    return this.qplayservice
  }

  /**
   * Get instance of Queue service
   *
   * @returns QueueService
   */
  QueueService () {
    if (!this.queueservice) {
      this.queueservice = new QueueService(this.host, this.port)
    }
    return this.queueservice
  }

  /**
   * Get instance of RenderingControl service
   *
   * @returns RenderingControlService
   */
  RenderingControlService () {
    if (!this.renderingcontrolservice) {
      this.renderingcontrolservice = new RenderingControlService(this.host, this.port)
    }
    return this.renderingcontrolservice
  }

  /**
   * Get instance of SystemProperties service
   *
   * @returns SystemPropertiesService
   */
  SystemPropertiesService () {
    if (!this.systempropertiesservice) {
      this.systempropertiesservice = new SystemPropertiesService(this.host, this.port)
    }
    return this.systempropertiesservice
  }

  /**
   * Get instance of VirtualLineIn service
   *
   * @returns VirtualLineInService
   */
  VirtualLineInService () {
    if (!this.virtuallineinservice) {
      this.virtuallineinservice = new VirtualLineInService(this.host, this.port)
    }
    return this.virtuallineinservice
  }

  /**
   * Get instance of ZoneGroupTopology service
   *
   * @returns ZoneGroupTopologyService
   */
  ZoneGroupTopologyService () {
    if (!this.zonegrouptopologyservice) {
      this.zonegrouptopologyservice = new ZoneGroupTopologyService(this.host, this.port)
    }
    return this.zonegrouptopologyservice
  }
}

module.exports = {
  AllServices,
  AlarmClockService,
  AudioInService,
  AVTransportService,
  ConnectionManagerService,
  ContentDirectoryService,
  DevicePropertiesService,
  GroupManagementService,
  GroupRenderingControlService,
  HTControlService,
  MusicServicesService,
  QPlayService,
  QueueService,
  RenderingControlService,
  SystemPropertiesService,
  VirtualLineInService,
  ZoneGroupTopologyService
}
