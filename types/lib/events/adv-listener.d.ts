/// <reference types="node" />
export = defaultListener;
declare const defaultListener: SonosListener;
/**
 * An event listener for sonos events. (Just a small http server)
 * @class SonosListener
 */
declare class SonosListener extends EventEmitter {
    /**
     * Creates a new SonosListener (called automatically)
     */
    constructor();
    port: number;
    _listening: boolean;
    _deviceSubscriptions: any[];
    _requestHandler: (req: any, resp: any) => void;
    _eventServer: http.Server;
    /**
     * Start the listener, has to be called before subscribing
     */
    startListener(): void;
    /**
     * Stop the listener and unsubscribes for all events.
     * Very important to call or you'll get wrong notifications
     */
    stopListener(): Promise<any>;
    isListening(): boolean;
    /**
     * Subscribe to all events for this device.
     * @param {import("../sonos").Sonos} device Pass in the Sonos device, it will be the eventemitter
     */
    subscribeTo(device: import("../sonos").Sonos): Promise<any>;
    _handleMessage(req: any, resp: any, body: any): void;
    _handleGlobalNotification(endpoint: any, body: any): Promise<void>;
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
import http = require("http");
