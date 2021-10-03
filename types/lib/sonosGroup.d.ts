export = SonosGroup;
declare class SonosGroup {
    constructor(zoneGroup: any);
    /**
     * @type {string}
     */
    CoordinatorID: string;
    /**
     * @type {Array<{ host: string, port: number | string, name: string}>}
     */
    Members: {
        host: string;
        port: number | string;
        name: string;
    }[];
    Name: any;
    Coordinator: {
        host: string;
        port: string;
    };
}
