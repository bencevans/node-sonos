var _ = require('underscore')
var sonos = require('../index')

var TIMEOUT = 2000 // Search for 2 seconds, increase this value if not all devices are shown
var devices = []

  // Functions to process device information

function getBridges (deviceList) {
  var bridges = []
  deviceList.forEach(function (device) {
    if (device.CurrentZoneName === 'BRIDGE' && bridges.indexOf(device.ip + ':' + device.port) === -1) {
      bridges.push(device.ip + ':' + device.port)
    }
  })
  return bridges
}

function getBridgeDevices (deviceList) {
  var bridgeDevices = []
  deviceList.forEach(function (device) {
    if (device.CurrentZoneName === 'BRIDGE') {
      bridgeDevices.push(device)
    }
  })
  return bridgeDevices
}

function getZones (deviceList) {
  var zones = []
  deviceList.forEach(function (device) {
    if (zones.indexOf(device.CurrentZoneName) === -1 && device.CurrentZoneName !== 'BRIDGE') {
      zones.push(device.CurrentZoneName)
    }
  })
  return zones
}

function getZoneDevices (zone, deviceList) {
  var zoneDevices = []
  deviceList.forEach(function (device) {
    if (device.CurrentZoneName === zone) {
      zoneDevices.push(device)
    }
  })
  return zoneDevices
}

function getZoneCoordinator (zone, deviceList) {
  var coordinator
  deviceList.forEach(function (device) {
    if (device.CurrentZoneName === zone && device.coordinator === 'true') {
      coordinator = device
    }
  })
  return coordinator
}

// Search and collect device information

sonos.search({timeout: TIMEOUT}, function (device, model) {
  var data = {ip: device.host, port: device.port, model: model}

  device.getZoneAttrs(function (err, attrs) {
    if (!err) {
      _.extend(data, attrs)
    }
    device.getZoneInfo(function (err, info) {
      if (!err) {
        _.extend(data, info)
      }
      device.getTopology(function (err, info) {
        if (!err) {
          info.zones.forEach(function (group) {
            if (group.location === 'http://' + data.ip + ':' + data.port + '/xml/device_description.xml') {
              _.extend(data, group)
            }
          })
        }
        devices.push(data)
      })
    })
  })
})

// Display device information in structured form

setTimeout(function () {
  console.log('\nBridges:\n--------')
  getBridges(devices).forEach(function (bridge) {
    console.log(bridge)
    getBridgeDevices(devices).forEach(function (device) {
      console.log('\t' + JSON.stringify(device))
    })
  })
  console.log('\nZones (coordinator):\n--------------------')
  getZones(devices).forEach(function (zone) {
    var coordinator = getZoneCoordinator(zone, devices)
    if (coordinator !== undefined) {
      console.log(zone + ' (' + coordinator.ip + ':' + coordinator.port + ')')
    }
    getZoneDevices(zone, devices).forEach(function (device) {
      console.log('\t' + JSON.stringify(device))
    })
  })
}, TIMEOUT)
