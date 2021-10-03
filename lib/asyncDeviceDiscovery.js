const DeviceDiscovery = require('./deviceDiscovery')
class AsyncDeviceDiscovery {
  /**
   * Discover one device, will return first device found
   * @param {object} options
   * @param {number} options.timeout Milliseconds to timeout
   * @returns {Promise<{device: import("./sonos").Sonos, model: string}>}
   */
  async discover (options = { timeout: 5000 }) {
    return new Promise((resolve, reject) => {
      const discovery = DeviceDiscovery(options)
      discovery.once('DeviceAvailable', (device, model) => {
        discovery.destroy()
        resolve({ device, model })
      })

      discovery.once('timeout', () => {
        reject(new Error('No device found'))
      })
    })
  }

  /**
   * Discover multiple devices, will return after timeout
   * @param {object} options
   * @param {number} options.timeout Milliseconds to timeout
   * @returns {Promise<import("./sonos").Sonos[]>}
   */
  async discoverMultiple (options = { timeout: 5000 }) {
    return new Promise((resolve, reject) => {
      const discovery = DeviceDiscovery(options)
      const devices = []
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
