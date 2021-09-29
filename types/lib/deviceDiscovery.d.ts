/// <reference types="node" />
export = deviceDiscovery;
/**
   * Create a DeviceDiscovery Instance (emits 'DeviceAvailable' with a found Sonos Component)
   * @param  {Object} options Optional Options to control search behavior.
   *                          Set 'timeout' to how long to search for devices
   *                          (in milliseconds).
   *                          Set 'port' to use a specific inbound UDP port,
   *                          rather than a randomly assigned one
   * @param  {Function} listener Optional 'DeviceAvailable' listener (sonos)
   * @return {DeviceDiscovery}
   */
declare function deviceDiscovery(options: any, listener: Function): DeviceDiscovery;
/**
 * Create a new instance of DeviceDiscovery
 * @class DeviceDiscovery
 * @emits 'DeviceAvailable' on a Sonos Component Discovery
 */
declare class DeviceDiscovery extends EventEmitter {
    constructor(options: any);
    foundSonosDevices: {};
    socket: dgram.Socket;
    searchTimer: NodeJS.Timeout;
    onTimeout(): void;
    sendDiscover(): void;
    pollTimer: NodeJS.Timeout;
    sendDiscoveryOnAddress(address: any): void;
    destroy(): void;
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
import dgram = require("dgram");
