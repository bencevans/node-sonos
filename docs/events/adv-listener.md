# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'events'
+ module:'request-promise-native'
+ module:'debug'

* * *

## Class: SonosListener

An event listener for sonos events. (Just a small http server)

## Class: SonosListener



## Class: SonosListener

Creates a new SonosListener (called automatically)

### sonos.SonosListener.startListener()

Start the listener, has to be called before subscribing


### sonos.SonosListener.stopListener()

Stop the listener and unsubscribes for all events.
Very important to call or you'll get wrong notifications


### sonos.SonosListener.subscribeTo(device)

Subscribe to all events for this device.

**Parameters**:

**device**: `Sonos`, Pass in the Sonos device, it will be the eventemitter


## Class: DeviceSubscription

DeviceSubscription, used internally to keep record of subscriptions

## Class: DeviceSubscription



## Class: DeviceSubscription

Create new subscription

### sonos.DeviceSubscription.addSubscription(endpoint)

Subscribe to specefic endpoint for this device

**Parameters**:

**endpoint**: `String`, What endpoint do we need to subscribe to?


### sonos.DeviceSubscription.renewAllSubscriptions()

Renew all subscriptions for this device


### sonos.DeviceSubscription.renewSubscription(sid)

Renew a single subscription

**Parameters**:

**sid**: `String`, Subscription id you want to renew


### sonos.DeviceSubscription.hasSubscription(sid)

Does this deivce have a subscription with a specific sid

**Parameters**:

**sid**: `String`, Subscription id


### sonos.DeviceSubscription.handleNotification(endpoint, body)

This will be called by the SonosListener for device specific devices

**Parameters**:

**endpoint**: `String`, The endpoint used for the subscription

**body**: `String`, The body of the event


### sonos.DeviceSubscription.cancelAllSubscriptions()

Cancel all the subscriptions for this device. Important to stop the notifications from returing.


### sonos.DeviceSubscription.cancelSubscription(sid)

Cancel a single subscribtion

**Parameters**:

**sid**: `String`, Subscription id


### sonos.DeviceSubscription.headerToDateTime(timeout)

Convert the Timeout header to datetime (legacy code...)

**Parameters**:

**timeout**: `String`, TimeOut header


* * *
