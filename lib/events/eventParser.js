
const Helpers = require('../helpers')

let EventParser = {}

EventParser.ParseEvent = async function (endpoint, body, device) {
  switch (endpoint) {
    case '/MediaRenderer/AVTransport/Event':
      return EventParser._parseAvTransportEvent(body, device.host, device.port)
    case '/MediaRenderer/RenderingControl/Event':
      return EventParser._parseRenderingControlEvent(body)

    default:
      return EventParser._genericEvent(endpoint, body)
  }
}

EventParser._parseAvTransportEvent = async function (body, host, port) {
    // TODO Do something
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID
  if (eventData.CurrentTrackMetaData.val) {
    let currMeta = await Helpers.ParseXml(eventData.CurrentTrackMetaData.val)
    eventData.CurrentTrackMetaData.parsed = Helpers.ParseDIDL(currMeta, host, port)
  }

  if (eventData['r:NextTrackMetaData'].val) {
    let nextMeta = await Helpers.ParseXml(eventData['r:NextTrackMetaData'].val)
    eventData['r:NextTrackMetaData'].parsed = Helpers.ParseDIDL(nextMeta, host, port)
  }

  return {name: 'AVTransportEvent', eventData: eventData}
}

EventParser._parseRenderingControlEvent = async function (body) {
    // TODO Do something
  let eventData = await Helpers.ParseXml(body.LastChange)
  eventData = eventData.Event.InstanceID
  return {name: 'RenderingControlEvent', eventData: eventData}
}

EventParser._genericEvent = function (endpoint, body) {
  return {name: 'UnknownEvent', endpoint: endpoint, body: body}
}

module.exports = EventParser
