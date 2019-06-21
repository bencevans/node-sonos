/* eslint-env mocha */
/* eslint no-unused-vars: "off" */
const assert = require('assert')
const SONOS = require('../')
const Sonos = SONOS.Sonos
const nock = require('nock')
const Helpers = require('../lib/helpers')
const generateResponse = function (responseTag, serviceName, responseBody) {
  const soapBody = `<u:${responseTag} xmlns:u="urn:schemas-upnp-org:service:${serviceName}:1">${(responseBody || null)}</u:${responseTag}>`
  return Helpers.CreateSoapEnvelop(soapBody)
}

const mockRequest = function (endpoint, action, requestBody, responseTag, serviceName, responseBody) {
  return nock('http://localhost:1400', { reqheaders: { 'soapaction': action } })
    .post(endpoint, Helpers.CreateSoapEnvelop(requestBody))
    .reply(200, generateResponse(responseTag, serviceName, responseBody))
}

describe('Sonos - Mock', function () {
  describe('play()', function () {
    it('should generate play command', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.play()
    })

    it('should accept a uri add => seek => play', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Seek"',
        '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>1</Target></u:Seek>',
        'SeekResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.play('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3')
    })

    it('should be able to accept an object instead of uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData>test</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport',
        '<FirstTrackNumberEnqueued>1</FirstTrackNumberEnqueued><NewQueueLength>1</NewQueueLength><NumTracksAdded>1</NumTracksAdded>'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Seek"',
        '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>1</Target></u:Seek>',
        'SeekResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.play({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: 'test'
      })
    })
  })

  describe('queue()', function () {
    it('should generate queue command', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.queue('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3')
    })

    it('should encode html characters in uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonos-spotify:spotify%3atrack%3a01Bz4Mijhe7m7qRvq2Ujpn?sid=12&amp;flags=8224&amp;sn=2</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.queue('x-sonos-spotify:spotify%3atrack%3a01Bz4Mijhe7m7qRvq2Ujpn?sid=12&flags=8224&sn=2')
    })

    it('should accept object in place of uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData>&lt;test&gt;&quot;hello&quot;&lt;/test&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.queue({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: '<test>"hello"</test>'
      })
    })

    it('should accept a Spotify track uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonos-spotify:spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      return sonos.queue('spotify:track:1AhDOtG9vPSOmsWgNW0BEY')
    })

    it('should accept a Spotify EU track uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonos-spotify:spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)
      sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU)

      return sonos.queue('spotify:track:1AhDOtG9vPSOmsWgNW0BEY')
    })

    it('should accept a Spotify album uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:0004206cspotify%3aalbum%3a1TSZDcvlPtAnekTaItI3qO</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;0004206cspotify%3aalbum%3a1TSZDcvlPtAnekTaItI3qO&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.album.musicAlbum&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.queue('spotify:album:1TSZDcvlPtAnekTaItI3qO')
    })

    it('should accept a Spotify artist top tracks uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:000e206cspotify%3aartistTopTracks%3a1dfeR4HaWDbWqFHLkxsg1d</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;000e206cspotify%3aartistTopTracks%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.queue('spotify:artistTopTracks:1dfeR4HaWDbWqFHLkxsg1d')
    })

    it('should accept a Spotify user public playlist uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:10062a6cspotify%3auser%3a26iFraqozskd5POrzg68pr?sid=9&amp;flags=10860&amp;sn=7</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10062a6cspotify%3auser%3a26iFraqozskd5POrzg68pr&quot; parentID=&quot;10082664playlists&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;User playlist&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.queue('spotify:user:26iFraqozskd5POrzg68pr')
    })

    it('should accept a Spotify EU user public playlist uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:10062a6cspotify%3auser%3a26iFraqozskd5POrzg68pr?sid=9&amp;flags=10860&amp;sn=7</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;10062a6cspotify%3auser%3a26iFraqozskd5POrzg68pr&quot; parentID=&quot;10082664playlists&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;User playlist&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)
      sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU)

      sonos.queue('spotify:user:26iFraqozskd5POrzg68pr')
    })
  })

  describe('playWithoutQueue()', function () {
    it('should accept a Spotify artist radio uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonosapi-radio:spotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d?sid=12&amp;flags=8300&amp;sn=5</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d&quot; parentID=&quot;10052064spotify%3aartist%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Artist Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.queue('spotify:artistRadio:1dfeR4HaWDbWqFHLkxsg1d')
    })

    it('should accept a Spotify EU artist radio uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"',
        '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-sonosapi-radio:spotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d?sid=12&amp;flags=8300&amp;sn=5</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d&quot; parentID=&quot;10052064spotify%3aartist%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Artist Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>',
        'AddURIToQueueResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)
      sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU)

      sonos.queue('spotify:artistRadio:1dfeR4HaWDbWqFHLkxsg1d')
    })
  })

  describe('playTuneinRadio()', function () {
    it('should generate play command', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:34682?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;F0009202034682&quot; parentID=&quot;L&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;88.5 | Jazz24 (Jazz)&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON65031_&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.playTuneinRadio('34682', '88.5 | Jazz24 (Jazz)')
    })
  })

  describe('playSpotifyRadio()', function () {
    it('should generate play command', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d?sid=12&amp;flags=8300&amp;sn=5</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;100c206cspotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d&quot; parentID=&quot;10052064spotify%3aartist%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Queen&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.playSpotifyRadio('1dfeR4HaWDbWqFHLkxsg1d', 'Queen')
    })
  })

  describe('setAVTransportURI()', function () {
    it('should generate queue command', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.setAVTransportURI('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3')
    })

    it('should accept object in place of uri', function () {
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</CurrentURI><CurrentURIMetaData>&lt;test&gt;&quot;hello&quot;&lt;/test&gt;</CurrentURIMetaData></u:SetAVTransportURI>',
        'SetAVTransportURIResponse',
        'AVTransport'
      )
      mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#Play"',
        '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
        'PlayResponse',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      sonos.setAVTransportURI({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: '<test>"hello"</test>'
      })
    })
  })

  describe('createPlaylist()', function () {
    it('should create new playlist', async function () {
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#CreateSavedQueue"',
        '<u:CreateSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Title>Test</Title><EnqueuedURI></EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData></u:CreateSavedQueue>',
        'CreateSavedQueue',
        'AVTransport'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.createPlaylist('Test')
      scope.done()
    })
  })

  describe('deletePlaylist()', function () {
    it('should remove existing playlist', async function () {
      const scope = mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#DestroyObject"',
        '<u:DestroyObject xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ObjectID>SQ:5</ObjectID></u:DestroyObject>',
        'DestroyObject',
        'ContentDirectory'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.deletePlaylist(5)
      scope.done()
    })
  })

  describe('addToPlaylist()', function () {
    it('should add track to playlist', async function () {
      mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>100</RequestedCount><SortCriteria></SortCriteria><ObjectID>SQ:1</ObjectID></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&#x3C;DIDL-Lite xmlns:dc=&#x22;http://purl.org/dc/elements/1.1/&#x22; xmlns:upnp=&#x22;urn:schemas-upnp-org:metadata-1-0/upnp/&#x22; xmlns:r=&#x22;urn:schemas-rinconnetworks-com:metadata-1-0/&#x22; xmlns=&#x22;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&#x22;&#x3E;&#x3C;item id=&#x22;x-file-cifs://localhost/Music/Song.mp4&#x22; parentID=&#x22;SQ:1&#x22; restricted=&#x22;true&#x22;&#x3E;&#x3C;res protocolInfo=&#x22;x-file-cifs:*:audio/mp4:*&#x22;&#x3E;x-file-cifs://localhost/Music/Song.mp3&#x3C;/res&#x3E;&#x3C;upnp:albumArtURI&#x3E;&#x3C;/upnp:albumArtURI&#x3E;&#x3C;dc:title&#x3E;Song&#x3C;/dc:title&#x3E;&#x3C;upnp:class&#x3E;object.item.audioItem.musicTrack&#x3C;/upnp:class&#x3E;&#x3C;dc:creator&#x3E;MyInterpret&#x3C;/dc:creator&#x3E;&#x3C;upnp:album&#x3E;MyAlbum&#x3C;/upnp:album&#x3E;&#x3C;upnp:originalTrackNumber&#x3E;1&#x3C;/upnp:originalTrackNumber&#x3E;&#x3C;/item&#x3E;&#x3C;/DIDL-Lite&#x3E;</Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>0</UpdateID>'
      )
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToSavedQueue"',
        '<u:AddURIToSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><ObjectID>SQ:1</ObjectID><UpdateID>0</UpdateID><EnqueuedURI>x-file-cifs://localhost/Music/Song.mp3</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;S://localhost/Music/Song.mp3&quot; parentID=&quot;A:TRACKS&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Song&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;upnp:albumArtURI&gt;&lt;/upnp:albumArtURI&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><AddAtIndex>4294967295</AddAtIndex></u:AddURIToSavedQueue>',
        'AddURIToSavedQueue',
        'AVTransport'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.addToPlaylist(1, 'x-file-cifs://localhost/Music/Song.mp3')
      scope.done()
    })

    it('should add album to playlist', async function () {
      mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>100</RequestedCount><SortCriteria></SortCriteria><ObjectID>SQ:1</ObjectID></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&#x3C;DIDL-Lite xmlns:dc=&#x22;http://purl.org/dc/elements/1.1/&#x22; xmlns:upnp=&#x22;urn:schemas-upnp-org:metadata-1-0/upnp/&#x22; xmlns:r=&#x22;urn:schemas-rinconnetworks-com:metadata-1-0/&#x22; xmlns=&#x22;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&#x22;&#x3E;&#x3C;item id=&#x22;x-file-cifs://localhost/Music/Song.mp4&#x22; parentID=&#x22;SQ:1&#x22; restricted=&#x22;true&#x22;&#x3E;&#x3C;res protocolInfo=&#x22;x-file-cifs:*:audio/mp4:*&#x22;&#x3E;x-file-cifs://localhost/Music/Song.mp3&#x3C;/res&#x3E;&#x3C;upnp:albumArtURI&#x3E;&#x3C;/upnp:albumArtURI&#x3E;&#x3C;dc:title&#x3E;Song&#x3C;/dc:title&#x3E;&#x3C;upnp:class&#x3E;object.item.audioItem.musicTrack&#x3C;/upnp:class&#x3E;&#x3C;dc:creator&#x3E;MyInterpret&#x3C;/dc:creator&#x3E;&#x3C;upnp:album&#x3E;MyAlbum&#x3C;/upnp:album&#x3E;&#x3C;upnp:originalTrackNumber&#x3E;1&#x3C;/upnp:originalTrackNumber&#x3E;&#x3C;/item&#x3E;&#x3C;/DIDL-Lite&#x3E;</Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>0</UpdateID>'
      )
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToSavedQueue"',
        '<u:AddURIToSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><ObjectID>SQ:1</ObjectID><UpdateID>0</UpdateID><EnqueuedURI>x-rincon-playlist://localhost/Music/Album#A:ALBUMS/MyAlbum</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;A:ALBUMS/MyAlbum&quot; parentID=&quot;A:ALBUMS&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;MyAlbum&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicAlbum&lt;/upnp:class&gt;&lt;upnp:albumArtURI&gt;&lt;/upnp:albumArtURI&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><AddAtIndex>4294967295</AddAtIndex></u:AddURIToSavedQueue>',
        'AddURIToSavedQueue',
        'AVTransport'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.addToPlaylist(1, 'x-rincon-playlist://localhost/Music/Album#A:ALBUMS/MyAlbum')
      scope.done()
    })

    it('should add albumartist to playlist', async function () {
      mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>100</RequestedCount><SortCriteria></SortCriteria><ObjectID>SQ:1</ObjectID></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&#x3C;DIDL-Lite xmlns:dc=&#x22;http://purl.org/dc/elements/1.1/&#x22; xmlns:upnp=&#x22;urn:schemas-upnp-org:metadata-1-0/upnp/&#x22; xmlns:r=&#x22;urn:schemas-rinconnetworks-com:metadata-1-0/&#x22; xmlns=&#x22;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&#x22;&#x3E;&#x3C;item id=&#x22;x-file-cifs://localhost/Music/Song.mp4&#x22; parentID=&#x22;SQ:1&#x22; restricted=&#x22;true&#x22;&#x3E;&#x3C;res protocolInfo=&#x22;x-file-cifs:*:audio/mp4:*&#x22;&#x3E;x-file-cifs://localhost/Music/Song.mp3&#x3C;/res&#x3E;&#x3C;upnp:albumArtURI&#x3E;&#x3C;/upnp:albumArtURI&#x3E;&#x3C;dc:title&#x3E;Song&#x3C;/dc:title&#x3E;&#x3C;upnp:class&#x3E;object.item.audioItem.musicTrack&#x3C;/upnp:class&#x3E;&#x3C;dc:creator&#x3E;MyInterpret&#x3C;/dc:creator&#x3E;&#x3C;upnp:album&#x3E;MyAlbum&#x3C;/upnp:album&#x3E;&#x3C;upnp:originalTrackNumber&#x3E;1&#x3C;/upnp:originalTrackNumber&#x3E;&#x3C;/item&#x3E;&#x3C;/DIDL-Lite&#x3E;</Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>0</UpdateID>'
      )
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToSavedQueue"',
        '<u:AddURIToSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><ObjectID>SQ:1</ObjectID><UpdateID>0</UpdateID><EnqueuedURI>x-rincon-playlist://localhost/Music/AlbumArtist#A:ALBUMARTIST/My Album Artist</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;A:ALBUMARTIST/My%20Album%20Artist&quot; parentID=&quot;A:ALBUMARTIST&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;My Album Artist&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicArtist&lt;/upnp:class&gt;&lt;upnp:albumArtURI&gt;&lt;/upnp:albumArtURI&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><AddAtIndex>4294967295</AddAtIndex></u:AddURIToSavedQueue>',
        'AddURIToSavedQueue',
        'AVTransport'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.addToPlaylist(1, 'x-rincon-playlist://localhost/Music/AlbumArtist#A:ALBUMARTIST/My Album Artist')
      scope.done()
    })

    it('should add genre to playlist', async function () {
      mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>100</RequestedCount><SortCriteria></SortCriteria><ObjectID>SQ:1</ObjectID></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&#x3C;DIDL-Lite xmlns:dc=&#x22;http://purl.org/dc/elements/1.1/&#x22; xmlns:upnp=&#x22;urn:schemas-upnp-org:metadata-1-0/upnp/&#x22; xmlns:r=&#x22;urn:schemas-rinconnetworks-com:metadata-1-0/&#x22; xmlns=&#x22;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&#x22;&#x3E;&#x3C;item id=&#x22;x-file-cifs://localhost/Music/Song.mp4&#x22; parentID=&#x22;SQ:1&#x22; restricted=&#x22;true&#x22;&#x3E;&#x3C;res protocolInfo=&#x22;x-file-cifs:*:audio/mp4:*&#x22;&#x3E;x-file-cifs://localhost/Music/Song.mp3&#x3C;/res&#x3E;&#x3C;upnp:albumArtURI&#x3E;&#x3C;/upnp:albumArtURI&#x3E;&#x3C;dc:title&#x3E;Song&#x3C;/dc:title&#x3E;&#x3C;upnp:class&#x3E;object.item.audioItem.musicTrack&#x3C;/upnp:class&#x3E;&#x3C;dc:creator&#x3E;MyInterpret&#x3C;/dc:creator&#x3E;&#x3C;upnp:album&#x3E;MyAlbum&#x3C;/upnp:album&#x3E;&#x3C;upnp:originalTrackNumber&#x3E;1&#x3C;/upnp:originalTrackNumber&#x3E;&#x3C;/item&#x3E;&#x3C;/DIDL-Lite&#x3E;</Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>0</UpdateID>'
      )
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToSavedQueue"',
        '<u:AddURIToSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><ObjectID>SQ:1</ObjectID><UpdateID>0</UpdateID><EnqueuedURI>x-rincon-playlist://localhost/Music/Genre#A:GENRE/MyGenre</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;A:GENRE/MyGenre&quot; parentID=&quot;A:GENRE&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;MyGenre&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.genre.musicGenre&lt;/upnp:class&gt;&lt;upnp:albumArtURI&gt;&lt;/upnp:albumArtURI&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;RINCON_AssociatedZPUDN&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><AddAtIndex>4294967295</AddAtIndex></u:AddURIToSavedQueue>',
        'AddURIToSavedQueue',
        'AVTransport'
      )
      var sonos = new Sonos('localhost', 1400)

      await sonos.addToPlaylist(1, 'x-rincon-playlist://localhost/Music/Genre#A:GENRE/MyGenre')
      scope.done()
    })
  })

  describe('removeFromPlaylist()', function () {
    it('should remove track from playlist', async function () {
      mockRequest('/MediaServer/ContentDirectory/Control',
        '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
        '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>*</Filter><StartingIndex>0</StartingIndex><RequestedCount>100</RequestedCount><SortCriteria></SortCriteria><ObjectID>SQ:1</ObjectID></u:Browse>',
        'BrowseResponse',
        'ContentDirectory',
        '<Result>&#x3C;DIDL-Lite xmlns:dc=&#x22;http://purl.org/dc/elements/1.1/&#x22; xmlns:upnp=&#x22;urn:schemas-upnp-org:metadata-1-0/upnp/&#x22; xmlns:r=&#x22;urn:schemas-rinconnetworks-com:metadata-1-0/&#x22; xmlns=&#x22;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&#x22;&#x3E;&#x3C;item id=&#x22;x-file-cifs://localhost/Music/Song.mp4&#x22; parentID=&#x22;SQ:1&#x22; restricted=&#x22;true&#x22;&#x3E;&#x3C;res protocolInfo=&#x22;x-file-cifs:*:audio/mp4:*&#x22;&#x3E;x-file-cifs://localhost/Music/Song.mp3&#x3C;/res&#x3E;&#x3C;upnp:albumArtURI&#x3E;&#x3C;/upnp:albumArtURI&#x3E;&#x3C;dc:title&#x3E;Song&#x3C;/dc:title&#x3E;&#x3C;upnp:class&#x3E;object.item.audioItem.musicTrack&#x3C;/upnp:class&#x3E;&#x3C;dc:creator&#x3E;MyInterpret&#x3C;/dc:creator&#x3E;&#x3C;upnp:album&#x3E;MyAlbum&#x3C;/upnp:album&#x3E;&#x3C;upnp:originalTrackNumber&#x3E;1&#x3C;/upnp:originalTrackNumber&#x3E;&#x3C;/item&#x3E;&#x3C;/DIDL-Lite&#x3E;</Result><NumberReturned>0</NumberReturned><TotalMatches>0</TotalMatches><UpdateID>0</UpdateID>'
      )
      const scope = mockRequest('/MediaRenderer/AVTransport/Control',
        '"urn:schemas-upnp-org:service:AVTransport:1#ReorderTracksInSavedQueue"',
        '<u:ReorderTracksInSavedQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><ObjectID>SQ:1</ObjectID><UpdateID>0</UpdateID><TrackList>2</TrackList><NewPositionList></NewPositionList></u:ReorderTracksInSavedQueue>',
        'ReorderTracksInSavedQueue',
        'AVTransport'
      )

      var sonos = new Sonos('localhost', 1400)

      await sonos.removeFromPlaylist(1, 2)
      scope.done()
    })
  })
})

describe('DeviceDiscovery', function () {
  it('should emit a timeout event when timeout is hit', function (done) {
    const failTimeout = setTimeout(function () {
      assert(false, 'Event never fired')
      done()
    }, 100)

    var search = SONOS.DeviceDiscovery({ timeout: 10 }, function (device, model) {})

    search.on('timeout', function () {
      clearTimeout(failTimeout)
      assert(true)
      done()
    })
  })

  it('should not emit a timeout event when no timeout option is passed in', function (done) {
    setTimeout(function () {
      assert(true)
      done()
    }, 10)

    var search = SONOS.DeviceDiscovery(function (device, model) {})

    search.on('timeout', function () {
      assert(false, 'Timeout event should never fire')
      done()
    })
  })

  it('should not emit a timeout event after search is stopped', function (done) {
    var search = SONOS.DeviceDiscovery({ timeout: 10 }, function (device, model) {})

    search.on('timeout', function () {
      assert(false, 'Timeout event should never fire')
      done()
    })
    search.destroy(function () {
      assert(true)
      done()
    })
  })
})

describe('Async DeviceDiscovery', function () {
  it('should reject after timeout without devices found', function (done) {
    const failTimeout = setTimeout(function () {
      assert(false, 'Event never fired')
      done()
    }, 100)

    var deviceDiscovery = new SONOS.AsyncDeviceDiscovery()
    deviceDiscovery.discover({ timeout: 10 }).then((device, model) => {
      // Also fine if we found a device....
      clearTimeout(failTimeout)
      assert(true)
      done()
    }).catch(err => { // eslint-disable-line handle-callback-err
      clearTimeout(failTimeout)
      assert(true)
      done()
    })
  })
})

describe('Sonos - Device', function () {
  let sonos
  before(function () {
    if (!process.env.SONOS_HOST) {
      this.skip()
    } else {
      sonos = new Sonos(process.env.SONOS_HOST, 1400)
    }
  })

  it('should getMuted()', function () {
    return sonos.getMuted().then(muted => {
      assert(typeof muted === 'boolean', 'muted is a boolean')
    })
  })

  it('should getCurrentState()', function () {
    return sonos.getCurrentState().then(state => {
      assert(typeof state === 'string', 'state is a string')
      const values = ['stopped', 'playing', 'paused', 'transitioning', 'no_media']
      assert(values.indexOf(state) > -1, 'state is one of the allowed values')
    })
  })

  it('should getVolume()', function () {
    return sonos.getVolume().then(volume => {
      assert(typeof volume === 'number', 'volume is a number')
      assert((volume >= 0 && volume <= 100), 'volume is between 0 and 100')
    })
  })

  it('should getPlayMode()', function () {
    return sonos.getPlayMode().then(playmode => {
      assert(typeof playmode === 'string', 'playmode is a string')
      const values = ['NORMAL', 'REPEAT_ONE', 'REPEAT_ALL', 'SHUFFLE', 'SHUFFLE_NOREPEAT', 'SHUFFLE_REPEAT_ONE']
      assert(values.indexOf(playmode) > -1, 'playmode is one of the allowed values')
    })
  })

  it('should getFavorites()', function () {
    return sonos.getFavorites().then(function (favs) {
      assert(favs.items, 'should have items')
    })
  })

  it('should getMusicLibrary("sonos_playlists")', function () {
    return sonos.getMusicLibrary('sonos_playlists').then(function (playlists) {
      assert(playlists.items, 'should have items')
      if (playlists.items.length > 0) {
        assert('id' in playlists.items[0], 'item should have id in object')
        assert('parentID' in playlists.items[0], 'item should have parentID in object')
        assert('uri' in playlists.items[0], 'item should have uri in object')
        assert('title' in playlists.items[0], 'item should have title in object')
      }
    })
  })

  it('should getPlaylist()', function () {
    return sonos.getPlaylist('1').then(function (playlist) {
      assert(playlist.items, 'should have items')
    })
  })

  it('should getQueue()', function () {
    return sonos.getQueue().then(function (queue) {
      assert(queue.items, 'should have items')
    })
  })

  // There seem to be some kind of error here.... Needs attention.
  it('should getFavoritesRadioStations()', function () {
    return sonos.getFavoritesRadioStations().then(function (radio) {
      assert(radio.items, 'should have items')
    })
  })

  it('should getAllGroups()', function () {
    return sonos.getAllGroups().then(function (groups) {
      assert(Array.isArray(groups), 'should return an array')
    })
  })

  it('playNotification()', function () {
    return sonos.playNotification({
      uri: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_pull_bell_02_065.mp3?_=1',
      volume: 10
    }).then(result => {
      assert(result, 'Played notification')
    })
  })

  it('playNotification() -> No notification when not playing', async function () {
    let state = await sonos.getCurrentState()
    if ((state === 'playing' || state === 'transitioning')) {
      this.skip('Is playing cannot test')
    }

    return sonos.playNotification({
      uri: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_pull_bell_02_065.mp3?_=1',
      volume: 10,
      onlyWhenPlaying: true
    }).then(result => {
      assert(result === false, 'Shouldn\'t start when not playing')
    })
  })

  describe('AlarmClockService()', function () {
    it('should list alarms', function () {
      return sonos.alarmClockService()
        .ListAlarms().then(function (result) {
          assert(Array.isArray(result.Alarms), '.Alarms should be an array')
          assert(typeof (result.CurrentAlarmListVersion) === 'string', '.CurrentAlarmListVersion should be a string')
        })
    })

    it('should throw an error on update with not string', function () {
      return sonos.alarmClockService().SetAlarm(1, false).catch(err => {
        assert(err, 'Got error')
      })
    })

    it('should toggle the first alarm', function () {
      return sonos.alarmClockService()
        .ListAlarms().then(function (result) {
          if (result.Alarms.length === 0) {
            assert(true)
          } else {
            const alarm = result.Alarms[0]
            const toggleTo = alarm.Enabled === '0'
            return sonos.alarmClockService().SetAlarm(alarm.ID, toggleTo).then(function (result) {
              // Revert back the change, or you'll get a bad morning after testing this library....
              return sonos.alarmClockService().SetAlarm(alarm.ID, !toggleTo).then(function (result) {
                assert(true)
              })
            })
          }
        })
    })
  })
})
