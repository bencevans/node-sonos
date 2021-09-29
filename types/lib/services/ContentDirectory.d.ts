export = ContentDirectory;
/**
 * Create a new instance of ContentDirectory
 * @class ContentDirectory
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
declare class ContentDirectory extends Service {
    constructor(host: any, port: any);
    _parseResult(input: any): Promise<any>;
    _enumItems(resultcontainer: any): any[];
    GetResult(options: any): Promise<{
        returned: any;
        total: any;
        updateID: any;
        items: any[];
    }>;
    Browse(options: any): Promise<any>;
    DestroyObject(options: any): Promise<any>;
    /**
     * See: http://docs.python-soco.com/en/latest/api/soco.music_library.html#soco.music_library.MusicLibrary.album_artist_display_option
     *
     * Possible values are:
     * 'WMP' - use Album Artists
     * 'ITUNES' - use iTunes® Compilations
     * 'NONE' - do not group compilations
     */
    GetSearchCapabilities(): Promise<any>;
    GetSortCapabilities(): Promise<any>;
    GetSystemUpdateID(): Promise<any>;
    GetAlbumArtistDisplayOption(): Promise<any>;
    GetLastIndexChange(): Promise<any>;
    FindPrefix(ObjectID: any, Prefix: any): Promise<any>;
    GetAllPrefixLocations(ObjectID: any): Promise<any>;
    CreateObject(ContainerID: any, Elements: any): Promise<any>;
    UpdateObject(ObjectID: any, CurrentTagValue: any): Promise<any>;
    RefreshShareIndex(AlbumArtistDisplayOption?: string): Promise<any>;
    RequestResort(SortOrder: any): Promise<any>;
    GetShareIndexInProgress(): Promise<any>;
    GetBrowseable(): Promise<any>;
    SetBrowseable(Browseable: any): Promise<any>;
}
import Service = require("./Service");
