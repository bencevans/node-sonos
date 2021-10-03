export = AsyncDeviceDiscovery;
declare class AsyncDeviceDiscovery {
    /**
     * Discover one device, will return first device found
     * @param {object} options
     * @param {number} options.timeout Milliseconds to timeout
     * @returns {Promise<{device: Sonos, model: string}>}
     */
    discover(options?: {
        timeout: number;
    }): Promise<{
        device: Sonos;
        model: string;
    }>;
    /**
     * Discover multiple devices, will return after timeout
     * @param {object} options
     * @param {number} options.timeout Milliseconds to timeout
     * @returns {Promise<Sonos[]>}
     */
    discoverMultiple(options?: {
        timeout: number;
    }): Promise<Sonos[]>;
}
import { Sonos } from "./sonos";
