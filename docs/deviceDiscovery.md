# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'events'
+ module:'dgram'
+ module:'./sonos'

* * *

## Class: DeviceDiscovery

Create a new instance of DeviceDiscovery

### sonos.DeviceDiscovery.destroy(callback)

Destroys DeviceDiscovery class, stop searching, clean up

**Parameters**:

**callback**: `function`, ()


### sonos.DeviceDiscovery.deviceDiscovery(options, listener)

Create a DeviceDiscovery Instance (emits 'DeviceAvailable' with a found Sonos Component)

**Parameters**:

**options**: `Object`, Optional Options to control search behavior.
                         Set 'timeout' to how long to search for devices
                         (in milliseconds).

**listener**: `function`, Optional 'DeviceAvailable' listener (sonos)

**Returns**: `DeviceDiscovery`

* * *
