/**
 * Sonos AllServices
 *
 * A generated class to access all Sonos UPNP services.
 *
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @exports
 * @class AllServices
 */
export class AllServices {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    host: string;
    port: number;
    /**
     * Get instance of AlarmClock service
     *
     * @returns {AlarmClockService}
     */
    AlarmClockService(): AlarmClockService;
    alarmclockservice: AlarmClockService;
    /**
     * Get instance of AudioIn service
     *
     * @returns {AudioInService}
     */
    AudioInService(): AudioInService;
    audioinservice: AudioInService;
    /**
     * Get instance of AVTransport service
     *
     * @returns {AVTransportService}
     */
    AVTransportService(): AVTransportService;
    avtransportservice: AVTransportService;
    /**
     * Get instance of ConnectionManager service
     *
     * @returns {ConnectionManagerService}
     */
    ConnectionManagerService(): ConnectionManagerService;
    connectionmanagerservice: ConnectionManagerService;
    /**
     * Get instance of ContentDirectory service
     *
     * @returns {ContentDirectoryService}
     */
    ContentDirectoryService(): ContentDirectoryService;
    contentdirectoryservice: ContentDirectoryService;
    /**
     * Get instance of DeviceProperties service
     *
     * @returns {DevicePropertiesService}
     */
    DevicePropertiesService(): DevicePropertiesService;
    devicepropertiesservice: DevicePropertiesService;
    /**
     * Get instance of GroupManagement service
     *
     * @returns {GroupManagementService}
     */
    GroupManagementService(): GroupManagementService;
    groupmanagementservice: GroupManagementService;
    /**
     * Get instance of GroupRenderingControl service
     *
     * @returns {GroupRenderingControlService}
     */
    GroupRenderingControlService(): GroupRenderingControlService;
    grouprenderingcontrolservice: GroupRenderingControlService;
    /**
     * Get instance of HTControl service
     *
     * @returns {HTControlService}
     */
    HTControlService(): HTControlService;
    htcontrolservice: HTControlService;
    /**
     * Get instance of MusicServices service
     *
     * @returns {MusicServicesService}
     */
    MusicServicesService(): MusicServicesService;
    musicservicesservice: MusicServicesService;
    /**
     * Get instance of QPlay service
     *
     * @returns {QPlayService}
     */
    QPlayService(): QPlayService;
    qplayservice: QPlayService;
    /**
     * Get instance of Queue service
     *
     * @returns {QueueService}
     */
    QueueService(): QueueService;
    queueservice: QueueService;
    /**
     * Get instance of RenderingControl service
     *
     * @returns {RenderingControlService}
     */
    RenderingControlService(): RenderingControlService;
    renderingcontrolservice: RenderingControlService;
    /**
     * Get instance of SystemProperties service
     *
     * @returns {SystemPropertiesService}
     */
    SystemPropertiesService(): SystemPropertiesService;
    systempropertiesservice: SystemPropertiesService;
    /**
     * Get instance of VirtualLineIn service
     *
     * @returns {VirtualLineInService}
     */
    VirtualLineInService(): VirtualLineInService;
    virtuallineinservice: VirtualLineInService;
    /**
     * Get instance of ZoneGroupTopology service
     *
     * @returns {ZoneGroupTopologyService}
     */
    ZoneGroupTopologyService(): ZoneGroupTopologyService;
    zonegrouptopologyservice: ZoneGroupTopologyService;
}
import AlarmClockService = require("./alarm-clock.service");
import AudioInService = require("./audio-in.service");
import AVTransportService = require("./av-transport.service");
import ConnectionManagerService = require("./connection-manager.service");
import ContentDirectoryService = require("./content-directory.service");
import DevicePropertiesService = require("./device-properties.service");
import GroupManagementService = require("./group-management.service");
import GroupRenderingControlService = require("./group-rendering-control.service");
import HTControlService = require("./ht-control.service");
import MusicServicesService = require("./music-services.service");
import QPlayService = require("./q-play.service");
import QueueService = require("./queue.service");
import RenderingControlService = require("./rendering-control.service");
import SystemPropertiesService = require("./system-properties.service");
import VirtualLineInService = require("./virtual-line-in.service");
import ZoneGroupTopologyService = require("./zone-group-topology.service");
export { AlarmClockService, AudioInService, AVTransportService, ConnectionManagerService, ContentDirectoryService, DevicePropertiesService, GroupManagementService, GroupRenderingControlService, HTControlService, MusicServicesService, QPlayService, QueueService, RenderingControlService, SystemPropertiesService, VirtualLineInService, ZoneGroupTopologyService };
