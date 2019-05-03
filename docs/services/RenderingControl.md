# sonos

Sonos library to control (almost) everything from your sonos devices

**Requires:**

+ module:'./Service'

* * *

## Class: RenderingControl

Create a new instance of RenderingControl

### sonos.RenderingControl.GetVolume(channel)

Get the volume

**Parameters**:

**channel**: `string`, Get to volume for this channel, `Master` is default.


### sonos.RenderingControl.SetVolume(volume, channel)

Set the volume for a speaker.

**Parameters**:

**volume**: `number`, The volume you want (0-100)

**channel**: `string`, The channel you want to set `Master` is default


### sonos.RenderingControl.SetRelativeVolume(volumeAdjustment, channel)

Adjust volume with relative value

**Parameters**:

**volumeAdjustment**: `number`, The volume adjustment

**channel**: `string`, The channel you want to set `Master` is default


### sonos.RenderingControl.GetMute(channel)

Check if the speaker is muted

**Parameters**:

**channel**: `string`, What channel do you want to check? `Master` is default.


### sonos.RenderingControl.SetMute(mute, channel)

(Un)mute the volume of a speaker.

**Parameters**:

**mute**: `boolean`, Should it be muted or unmuted?

**channel**: `string`, The channel you want to set `Master` is default


* * *
