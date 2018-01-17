
const Helpers = require('../helpers')

let EventParser = {}

EventParser.ParseAndEmitEvents = async function (endpoint, body, device) {
  switch (endpoint) {
    case '/MediaRenderer/AVTransport/Event':
      return EventParser._parseAvTransportEvent(body, device)
    case '/MediaRenderer/RenderingControl/Event':
      return EventParser._parseRenderingControlEvent(body, device)

    default:
      return EventParser._genericEvent(endpoint, body, device)
  }
}

EventParser._parseAvTransportEvent = async function (body, device) {
    // TODO Do something
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID
  if (eventData.CurrentTrackMetaData.val) {
    let currMeta = await Helpers.ParseXml(eventData.CurrentTrackMetaData.val)
    let track = Helpers.ParseDIDL(currMeta, device.host, device.port, eventData.CurrentTrackURI.val)

    device.emit('CurrentTrack', track)
    delete track.uri
    eventData.CurrentTrackMetaData.parsed = track
  }

  if (eventData['r:NextTrackMetaData'].val) {
    let nextMeta = await Helpers.ParseXml(eventData['r:NextTrackMetaData'].val)
    let uri = eventData['r:NextTrackURI'] ? eventData['r:NextTrackURI'].val : null
    let track = Helpers.ParseDIDL(nextMeta, device.host, device.port, uri)

    device.emit('NextTrack', track)
    delete track.uri
    eventData['r:NextTrackMetaData'].parsed = Helpers.ParseDIDL(nextMeta, device.host, device.port)
  }

  // State
  const state = Helpers.TranslateState(eventData.TransportState.val)
  if (device._state !== state) {
    device.emit('State', state)
    device._state = state
  }

  device.emit('AVTransport', eventData)
  return {name: 'AVTransportEvent', eventData: eventData}
}

EventParser._parseRenderingControlEvent = async function (body, device) {
    // TODO Do something
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID

  // Volume change
  if (eventData.Volume) {
    let volume = parseInt(eventData.Volume[0].val)
    if (volume !== device._volume) {
      device.emit('Volume', volume)
      device._volume = volume
    }
  }

  // Muted
  if (eventData.Mute) {
    let mute = (eventData.Mute[0].val === '1')
    if (mute !== device._mute) {
      device.emit('Muted', mute)
      device._mute = mute
    }
  }
  device.emit('RenderingControl', eventData)
  return {name: 'RenderingControlEvent', eventData: eventData}
}

EventParser._genericEvent = function (endpoint, body, device) {
  const event = {name: 'UnknownEvent', endpoint: endpoint, body: body}
  device.emit(event.name, event)
  return event
}

module.exports = EventParser
