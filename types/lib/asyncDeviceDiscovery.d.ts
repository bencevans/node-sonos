export = AsyncDeviceDiscovery;
declare class AsyncDeviceDiscovery {
    discover(options?: {
        timeout: number;
    }): Promise<any>;
    discoverMultiple(options?: {
        timeout: number;
    }): Promise<any>;
}
