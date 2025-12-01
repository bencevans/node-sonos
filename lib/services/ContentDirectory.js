/**
 * Sonos library to control (almost) everything from your sonos devices
 * @module sonos
 * @requires './Service'
 * @requires '../Helpers'
 */

const Service = require('./Service')
const Helpers = require('../helpers')

/**
 * Create a new instance of ContentDirectory
 * @class ContentDirectory
 * @param {String} host The host param of one of your sonos speakers
 * @param {Number} port The port of your sonos speaker, defaults to 1400
 */
class ContentDirectory extends Service {
  constructor (host, port) {
    super()
    this.name = 'ContentDirectory'
    this.host = host
    this.port = port || 1400
    this.controlURL = '/MediaServer/ContentDirectory/Control'
    this.eventSubURL = '/MediaServer/ContentDirectory/Event'
    this.SCPDURL = '/xml/ContentDirectory1.xml'
  }

  async _parseResult (input) {
    input.Result = await Helpers.ParseXml(input.Result)
    return input
  }

  _enumItems (resultcontainer) {
    if (resultcontainer === undefined) return
    if (Array.isArray(resultcontainer)) {
      const convertItem = function (item) {
        return Helpers.ParseDIDLItem(item, this.host, this.port, item.res._)
      }.bind(this)

      return resultcontainer.map(convertItem)
    } else {
      return [Helpers.ParseDIDLItem(resultcontainer, this.host, this.port, resultcontainer.res._)]
    }
  }

  async GetResult (options) {
    return this.Browse(options)
      .then(this._parseResult)
      .then(data => {
        let items = []
        if (data.Result['DIDL-Lite'].container) {
          items = this._enumItems(data.Result['DIDL-Lite'].container)
        } else {
          items = this._enumItems(data.Result['DIDL-Lite'].item)
        }

        return {
          returned: data.NumberReturned,
          total: data.TotalMatches,
          updateID: data.UpdateID,
          items
        }
      })
  }

  async Browse (options) {
    return this._request('Browse', options)
  }

  async DestroyObject (options) {
    return this._request('DestroyObject', options)
  }

  /**
   * See: http://docs.python-soco.com/en/latest/api/soco.music_library.html#soco.music_library.MusicLibrary.album_artist_display_option
   *
   * Possible values are:
   * 'WMP' - use Album Artists
   * 'ITUNES' - use iTunes® Compilations
   * 'NONE' - do not group compilations
   */
  async GetSearchCapabilities () {
    return this._request('GetSearchCapabilities', {}).then(
      (r) => r.SearchCaps
    )
  }

  async GetSortCapabilities () {
    return this._request('GetSortCapabilities', {}).then((r) => r.SortCaps)
  }

  async GetSystemUpdateID () {
    return this._request('GetSystemUpdateID', {}).then((r) => r.Id)
  }

  async GetAlbumArtistDisplayOption () {
    return this._request('GetAlbumArtistDisplayOption', {}).then(
      (r) => r.AlbumArtistDisplayOption
    )
  }

  async GetLastIndexChange () {
    return this._request('GetLastIndexChange', {}).then(
      (r) => r.LastIndexChange
    )
  }

  async FindPrefix (ObjectID, Prefix) {
    return this._request('FindPrefix', {
      ObjectID,
      Prefix
    })
  }

  async GetAllPrefixLocations (ObjectID) {
    return this._request('GetAllPrefixLocations', {
      ObjectID
    })
  }

  async CreateObject (ContainerID, Elements) {
    return this._request('CreateObject', {
      ContainerID,
      Elements
    })
  }

  async UpdateObject (ObjectID, CurrentTagValue) {
    return this._request('UpdateObject', {
      ObjectID,
      CurrentTagValue
    })
  }

  async RefreshShareIndex (AlbumArtistDisplayOption = '') {
    return this._request('RefreshShareIndex', {
      AlbumArtistDisplayOption
    })
  }

  async RequestResort (SortOrder) {
    return this._request('RequestResort', {
      SortOrder
    })
  }

  async GetShareIndexInProgress () {
    return this._request('GetShareIndexInProgress', {}).then(
      (r) => r.IsIndexing !== '0'
    )
  }

  async GetBrowseable () {
    return this._request('GetBrowseable', {}).then(
      (r) => r.IsBrowseable !== '0'
    )
  }

  async SetBrowseable (Browseable) {
    return this._request('SetBrowseable', {
      Browseable
    })
  }
}

module.exports = ContentDirectory
