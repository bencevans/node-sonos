export = AsyncDeviceDiscovery;
declare class AsyncDeviceDiscovery {
    /**
     * Discover one device, will return first device found
     * @param {object} options
     * @param {number} options.timeout Milliseconds to timeout
     * @returns {Promise<{device: import("./sonos").Sonos, model: string}>}
     */
    discover(options?: {
        timeout: number;
    }): Promise<{
        device: import("./sonos").Sonos;
        model: string;
    }>;
    /**
     * Discover multiple devices, will return after timeout
     * @param {object} options
     * @param {number} options.timeout Milliseconds to timeout
     * @returns {Promise<import("./sonos").Sonos[]>}
     */
    discoverMultiple(options?: {
        timeout: number;
    }): Promise<import("./sonos").Sonos[]>;
}
