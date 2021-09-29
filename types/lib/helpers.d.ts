/**
 * Wrap in UPnP Envelope
 * @param  {String} body The SOAP body.
 * @return {String}
 */
export function CreateSoapEnvelop(body: string): string;
/**
 * Encodes characters not allowed within html/xml tags, for use with nester xml.
 * @param  {String} input
 * @return {String}
 */
export function EncodeXml(input: string): string;
/**
 * Converts parentID to upnp cass
 * @param {String} parentID The id of the parent
 * @return {String} object.item.audioItem.musicTrack
 */
export function GetUpnpClass(parentID: string): string;
/**
 * Generate custom metadata, to be used with the play and/or setAVTransportURI
 * @param  {String} streamUri The playback uri
 * @param  {String} itemId
 * @param  {String} duration The duration of the song, as 'hh:mm:ss'
 * @param  {String} title The title of the song
 * @param  {String} artist The artist of the sons
 * @param  {String} album the album of the song
 * @param  {String} coverUrl the coverUrl of the song
 * @param  {String} parentId the parentId of the song
 */
export function GenerateCustomMetadata(streamUrl: any, itemId: string, duration: string, title: string, artist: string, album: string, coverUrl: string, parentId: string): string;
/**
 * Creates object with uri and metadata from playback uri
 * @param  {String} uri The playback uri
 * @param  {String} artUri Uri for art image
 * @return {Object} { uri: uri, metadata: metadata }
 */
export function GenerateLocalMetadata(uri: string, artUri?: string): any;
/**
 * Creates object with uri and metadata from playback uri
 * @param  {String} uri The playback uri (currently supports spotify, tunein)
 * @param  {String} title Sometimes the title is required.
 * @param  {String} region Spotify region is required for all spotify tracks, see `sonos.SpotifyRegion`
 * @return {Object} options       {uri: Spotify uri, metadata: metadata}
 */
export function GenerateMetadata(uri: string, title?: string, region?: string): any;
/**
 * Parse DIDL into track structure
 * @param {String} didl
 * @param {String} host host ip
 * @param {Number} port port numer
 * @param {String} trackUri Track Uri
 * @return {object}
 */
export function ParseDIDL(didl: string, host: string, port: number, trackUri: string): any;
export function dropIDNamespace(value: any): any;
export function ParseDIDLItem(item: any, host: any, port: any, trackUri: any): {
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
export function TimeToSeconds(time: string): number;
export function _ParseXml(input: any, callback: any): any;
/**
 * Convert the playbackstate to a bit more readable
 * @param {String} state Sonos playback state
 */
export function TranslateState(state: string): any;
/**
 * Parse Xml to an object async
 * @param {String} input The XML to be parsed
 * @return {Promise}
 */
export function ParseXml(input: string): Promise<any>;
/**
 * Sanitizes Device Description XML async
 * @param {String} input The XML to be sanitized
 * @return {Promise}
 */
export function SanitizeDeviceDescriptionXml(input: string): Promise<any>;
