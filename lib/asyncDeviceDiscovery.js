const DeviceDiscovery = require('./deviceDiscovery')
class AsyncDeviceDiscovery {
  async discover (options = { timeout: 5000 }) {
    return new Promise((resolve, reject) => {
      let discovery = DeviceDiscovery(options)
      discovery.once('DeviceAvailable', (device, model) => {
        discovery.destroy()
        resolve(device, model)
      })

      discovery.once('timeout', () => {
        reject(new Error('No device found'))
      })
    })
  }

  async discoverMultiple (options = { timeout: 5000 }) {
    return new Promise((resolve, reject) => {
      let discovery = DeviceDiscovery(options)
      let devices = []
      discovery.on('DeviceAvailable', (device, model) => {
        devices.push(device)
      })

      discovery.once('timeout', () => {
        if (devices.length > 0) {
          resolve(devices)
        } else {
          reject(new Error('No devices found'))
        }
      })
    })
  }
}

module.exports = AsyncDeviceDiscovery
