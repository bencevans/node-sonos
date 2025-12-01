const Helpers = require('../helpers')
const debug = require('debug')('sonos-listener')
const SonosGroup = require('../sonosGroup')

const EventParser = {}

EventParser.ParseAndEmitEvents = async function (endpoint, body, device) {
  switch (endpoint) {
    case '/MediaRenderer/AVTransport/Event':
      return EventParser._parseAvTransportEvent(body, device)
    case '/MediaRenderer/RenderingControl/Event':
      return EventParser._parseRenderingControlEvent(body, device)
    case '/AlarmClock/Event':
      return EventParser._parseAlarmEvent(body, device)
    case '/ZoneGroupTopology/Event':
      return EventParser._parseZoneGroupTopologyEvent(body, device)
    case '/MediaRenderer/GroupRenderingControl/Event':
      return EventParser._parseGroupRenderingControlEvent(body, device)
    case '/MediaRenderer/Queue/Event':
      return EventParser._parseQueueEvent(body, device)
    case '/MediaServer/ContentDirectory/Event':
      return EventParser._parseContentDirectoryEvent(body, device)
    default:
      return EventParser._genericEvent(endpoint, body, device)
  }
}

EventParser._parseAvTransportEvent = async function (body, device) {
  // TODO Do something
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID
  Object.keys(eventData).forEach((value, index, array) => {
    eventData[value] = eventData[value].val
  })
  debug('AvTransportEvent %j', eventData)
  if (eventData.CurrentTrackMetaData) {
    const currMeta = await Helpers.ParseXml(eventData.CurrentTrackMetaData)
    const track = Helpers.ParseDIDL(currMeta, device.host, device.port, eventData.CurrentTrackURI)
    track.duration = Helpers.TimeToSeconds(eventData.CurrentTrackDuration)
    track.queuePosition = parseInt(eventData.CurrentTrack)

    device.emit('CurrentTrack', track)
    device._track = track
    eventData.CurrentTrackMetaDataParsed = track
  }

  if (eventData['r:NextTrackMetaData']) {
    const nextMeta = await Helpers.ParseXml(eventData['r:NextTrackMetaData'])
    const uri = eventData['r:NextTrackURI'] || null
    const track = Helpers.ParseDIDL(nextMeta, device.host, device.port, uri)

    if (!device._nextTrack || track.uri !== device._nextTrack.uri) {
      device.emit('NextTrack', track)
      device._nextTrack = track
    }
    eventData['r:NextTrackMetaDataParsed'] = Helpers.ParseDIDL(nextMeta, device.host, device.port)
  }

  // State
  if (eventData.TransportState && eventData.TransportState) {
    const state = Helpers.TranslateState(eventData.TransportState)
    if (device._state !== state) {
      device.emit('PlayState', state)
      device._state = state
      if (state === 'stopped') device.emit('PlaybackStopped')
    }
  }

  device.emit('AVTransport', eventData)
  return { name: 'AVTransportEvent', eventBody: eventData }
}

EventParser._parseRenderingControlEvent = async function (body, device) {
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID

  // Volume change
  if (eventData.Volume) {
    const volume = parseInt(eventData.Volume[0].val)
    if (volume !== device._volume) {
      device.emit('Volume', volume)
      device._volume = volume
    }
  }

  // Muted
  if (eventData.Mute) {
    const mute = (eventData.Mute[0].val === '1')
    if (mute !== device._mute) {
      device.emit('Muted', mute)
      device._mute = mute
    }
  }
  device.emit('RenderingControl', eventData)
  return { name: 'RenderingControlEvent', eventBody: eventData }
}

EventParser._genericEvent = function (endpoint, body, device) {
  const event = { name: 'UnknownEvent', endpoint, eventBody: body }
  if (device) {
    device.emit(event.name, event)
  }

  return event
}

EventParser._parseContentDirectoryEvent = function (body, device) {
  debug('ContentDirectory event %j', body)
  const event = { name: 'ContentDirectory', eventBody: body }
  return event
}

EventParser._parseAlarmEvent = function (body, device) {
  debug('Alarm event %j', body)
  const event = { name: 'AlarmClock', eventBody: body }
  return event
}

EventParser._parseZoneGroupTopologyEvent = async function (body, device) {
  debug('ZoneGroupTopology event %j', body)
  const eventData = {}
  for (let index = 0; index < body.length; index++) {
    const element = body[index]
    const firstKey = Object.keys(element)[0]
    if (firstKey === 'ZoneGroupState' || firstKey === 'AvailableSoftwareUpdate') {
      eventData[firstKey] = await Helpers.ParseXml(element[firstKey])
    } else if (firstKey !== 'ThirdPartyMediaServersX') {
      eventData[firstKey] = element[firstKey]
    }
  }
  if (eventData.ZoneGroupState) {
    let zoneGroupState = eventData.ZoneGroupState
    if (zoneGroupState.ZoneGroupState) {
      zoneGroupState = zoneGroupState.ZoneGroupState
    }
    const zoneGroup = zoneGroupState.ZoneGroups.ZoneGroup
    if (Array.isArray(zoneGroup)) {
      eventData.Zones = zoneGroup.map(zone => { return new SonosGroup(zone) })
    } else {
      eventData.Zones = [new SonosGroup(zoneGroup)]
    }
  }
  return { name: 'ZoneGroupTopology', eventBody: eventData }
}

EventParser._parseGroupRenderingControlEvent = function (body, device) {
  device.emit('GroupRenderingControl', body)
  const event = { name: 'GroupRenderingControl', eventBody: body, device: { host: device.host, port: device.port } }
  return event
}

EventParser._parseQueueEvent = async function (body, device) {
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.QueueID
  debug('Queue event %j', eventData)

  device.emit('QueueChanged', eventData)
  return { name: 'Queue', eventBody: eventData }
}

module.exports = EventParser
