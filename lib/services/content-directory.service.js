const Service = require('./Service')
/**
 * Sonos ContentDirectoryService
 *
 * Browse for local content
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class ContentDirectoryService
 * @extends {Service}
 */
class ContentDirectoryService extends Service {
  /**
   *
   * @param {string} host Sonos host
   * @param {number} port Sonos port, default `1400`
   */
  constructor (host, port) {
    super()
    this.name = 'ContentDirectory'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaServer/ContentDirectory/Control'
    this.eventSubURL = '/MediaServer/ContentDirectory/Event'
    this.SCPDURL = '/xml/ContentDirectory1.xml'
  }

  // #region actions
  /**
   * Browse - Browse for content: Music library (A), share(S:), Sonos playlists(SQ:), Sonos favorites(FV:2), radio stations(R:0/0), radio shows(R:0/1). Recommendation: Send one request, check the `TotalMatches` and - if necessary - do additional requests with higher `StartingIndex`. In case of duplicates only the first is returned! Example: albums with same title, even if artists are different
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID - The search query, (`A:ARTIST` / `A:ALBUMARTIST` / `A:ALBUM` / `A:GENRE` / `A:COMPOSER` / `A:TRACKS` / `A:PLAYLISTS` / `S:` / `SQ:` / `FV:2` / `R:0/0` / `R:0/1`) with optionally `:search+query` behind it.
   * @param {string} options.BrowseFlag - How to browse [ 'BrowseMetadata' / 'BrowseDirectChildren' ]
   * @param {string} options.Filter - Which fields should be returned `*` for all.
   * @param {number} options.StartingIndex - Paging, where to start, usually 0
   * @param {number} options.RequestedCount - Paging, number of items, maximum is 1,000. This parameter does NOT restrict the number of items being searched (filter) but only the number being returned.
   * @param {string} options.SortCriteria - Sort the results based on metadata fields. `+upnp:artist,+dc:title` for sorting on artist then on title.
   * @remarks (1) If the title contains an apostrophe the returned uri will contain a `&apos;`. (2) Some libraries support a BrowseAndParse, so you don't have to parse the xml.
   * @returns {Promise<Object>} response object, with these properties `Result`, `NumberReturned`, `TotalMatches`, `UpdateID`
   */
  async Browse (options) { return this._request('Browse', options) }

  /**
   * CreateObject
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ContainerID
   * @param {string} options.Elements
   * @returns {Promise<Object>} response object, with these properties `ObjectID`, `Result`
   */
  async CreateObject (options) { return this._request('CreateObject', options) }

  /**
   * DestroyObject
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID
   * @returns {Promise<Boolean>} request succeeded
   */
  async DestroyObject (options) { return this._request('DestroyObject', options) }

  /**
   * FindPrefix
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID
   * @param {string} options.Prefix
   * @returns {Promise<Object>} response object, with these properties `StartingIndex`, `UpdateID`
   */
  async FindPrefix (options) { return this._request('FindPrefix', options) }

  /**
   * GetAlbumArtistDisplayOption
   * @returns {Promise<Object>} response object, with these properties `AlbumArtistDisplayOption`
   */
  async GetAlbumArtistDisplayOption () { return this._request('GetAlbumArtistDisplayOption') }

  /**
   * GetAllPrefixLocations
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID
   * @returns {Promise<Object>} response object, with these properties `TotalPrefixes`, `PrefixAndIndexCSV`, `UpdateID`
   */
  async GetAllPrefixLocations (options) { return this._request('GetAllPrefixLocations', options) }

  /**
   * GetBrowseable
   * @returns {Promise<Object>} response object, with these properties `IsBrowseable`
   */
  async GetBrowseable () { return this._request('GetBrowseable') }

  /**
   * GetLastIndexChange
   * @returns {Promise<Object>} response object, with these properties `LastIndexChange`
   */
  async GetLastIndexChange () { return this._request('GetLastIndexChange') }

  /**
   * GetSearchCapabilities
   * @returns {Promise<Object>} response object, with these properties `SearchCaps`
   */
  async GetSearchCapabilities () { return this._request('GetSearchCapabilities') }

  /**
   * GetShareIndexInProgress
   * @returns {Promise<Object>} response object, with these properties `IsIndexing`
   */
  async GetShareIndexInProgress () { return this._request('GetShareIndexInProgress') }

  /**
   * GetSortCapabilities
   * @returns {Promise<Object>} response object, with these properties `SortCaps`
   */
  async GetSortCapabilities () { return this._request('GetSortCapabilities') }

  /**
   * GetSystemUpdateID
   * @returns {Promise<Object>} response object, with these properties `Id`
   */
  async GetSystemUpdateID () { return this._request('GetSystemUpdateID') }

  /**
   * RefreshShareIndex
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.AlbumArtistDisplayOption
   * @returns {Promise<Boolean>} request succeeded
   */
  async RefreshShareIndex (options) { return this._request('RefreshShareIndex', options) }

  /**
   * RequestResort
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.SortOrder
   * @returns {Promise<Boolean>} request succeeded
   */
  async RequestResort (options) { return this._request('RequestResort', options) }

  /**
   * SetBrowseable
   *
   * @param {Object} [options] - An object with the following properties
   * @param {boolean} options.Browseable
   * @returns {Promise<Boolean>} request succeeded
   */
  async SetBrowseable (options) { return this._request('SetBrowseable', options) }

  /**
   * UpdateObject
   *
   * @param {Object} [options] - An object with the following properties
   * @param {string} options.ObjectID
   * @param {string} options.CurrentTagValue
   * @param {string} options.NewTagValue
   * @returns {Promise<Boolean>} request succeeded
   */
  async UpdateObject (options) { return this._request('UpdateObject', options) }
  // #endregion
}

module.exports = ContentDirectoryService
