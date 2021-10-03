import SonosGroup = require("../sonosGroup");
export function ParseAndEmitEvents(endpoint: any, body: any, device: any): Promise<{
    name: string;
    eventBody: any;
}>;
export function _parseAvTransportEvent(body: any, device: any): Promise<{
    name: string;
    eventBody: any;
}>;
export function _parseRenderingControlEvent(body: any, device: any): Promise<{
    name: string;
    eventBody: any;
}>;
export function _genericEvent(endpoint: any, body: any, device: any): {
    name: string;
    endpoint: any;
    eventBody: any;
};
export function _parseContentDirectoryEvent(body: any, device: any): {
    name: string;
    eventBody: any;
};
export function _parseAlarmEvent(body: any, device: any): {
    name: string;
    eventBody: any;
};
export function _parseZoneGroupTopologyEvent(body: any, device: any): Promise<{
    name: string;
    eventBody: {
        Zones: SonosGroup[];
    };
}>;
export function _parseGroupRenderingControlEvent(body: any, device: any): {
    name: string;
    eventBody: any;
    device: {
        host: any;
        port: any;
    };
};
export function _parseQueueEvent(body: any, device: any): Promise<{
    name: string;
    eventBody: any;
}>;
