export = Helpers;
declare class Helpers {
    /**
     * Wrap in UPnP Envelope
     * @param  {String} body The SOAP body.
     * @return {String}
     */
    static CreateSoapEnvelop(body: string): string;
    /**
   * Encodes characters not allowed within html/xml tags, for use with nester xml.
   * @param  {String} input
   * @return {String}
   */
    static EncodeXml(input: string): string;
    /**
   * Converts parentID to upnp cass
   * @param {String} parentID The id of the parent
   * @return {String} object.item.audioItem.musicTrack
   */
    static GetUpnpClass(parentID: string): string;
    /**
   * Generate custom metadata, to be used with the play and/or setAVTransportURI
   * @param  {String} streamUrl The playback uri
   * @param  {String} itemId
   * @param  {String} duration The duration of the song, as 'hh:mm:ss'
   * @param  {String} title The title of the song
   * @param  {String} artist The artist of the sons
   * @param  {String} album the album of the song
   * @param  {String} coverUrl the coverUrl of the song
   * @param  {String} parentId the parentId of the song
   */
    static GenerateCustomMetadata(streamUrl: string, itemId: string, duration: string, title: string, artist: string, album: string, coverUrl: string, parentId: string): string;
    /**
   * Creates object with uri and metadata from playback uri
   * @param  {String} uri The playback uri
   * @param  {String} artUri Uri for art image
   * @return {Object} { uri: uri, metadata: metadata }
   */
    static GenerateLocalMetadata(uri: string, artUri?: string): any;
    /**
   * Creates object with uri and metadata from playback uri
   * @param  {String} uri The playback uri (currently supports spotify, tunein)
   * @param  {String} title Sometimes the title is required.
   * @param  {String} region Spotify region is required for all spotify tracks, see `sonos.SpotifyRegion`
   * @return {Object} options       {uri: Spotify uri, metadata: metadata}
   */
    static GenerateMetadata(uri: string, title?: string, region?: string): any;
    /**
   * Parse DIDL into track structure
   * @param {string} didl
   * @param {string} host host ip
   * @param {Number} port port numer
   * @param {string | undefined} trackUri Track Uri
   * @return {object}
   */
    static ParseDIDL(didl: string, host?: string, port?: number, trackUri?: string | undefined): object;
    static dropIDNamespace(value: any): any;
    static ParseDIDLItem(item: any, host?: any, port?: any, trackUri?: any): {
        id: any;
        parentID: any;
        title: any;
        artist: any;
        album: any;
        albumArtist: any;
        albumArtURI: any;
    };
    /**
   * Convert a time string to seconds
   * @param  {String} time like `00:03:34`
   * @returns {Number} number of seconds like 214
   */
    static TimeToSeconds(time: string): number;
    /**
     *
     * @param {string} input
     * @param {function} callback
     * @returns {Object}
     */
    static _ParseXml(input: string, callback: Function): any;
    /**
   * Convert the playbackstate to a bit more readable
   * @param {string} state Sonos playback state
   * @returns {string}
   */
    static TranslateState(state: string): string;
    /**
   * Parse Xml to an object async
   * @param {String} input The XML to be parsed
   * @return {Promise}
   */
    static ParseXml(input: string): Promise<any>;
    /**
   * Sanitizes Device Description XML async
   * @param {String} input The XML to be sanitized
   * @return {string}
   */
    static SanitizeDeviceDescriptionXml(input: string): string;
}
