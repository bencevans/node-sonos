export = SonosGroup;
declare class SonosGroup {
    constructor(zoneGroup: any);
    CoordinatorID: any;
    Members: any[];
    Name: any;
    Coordinator: {
        host: string;
        port: string;
    };
}
