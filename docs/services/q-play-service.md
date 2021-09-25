---
layout: default
title: QPlay
---
# QPlay service

Services related to Chinese Tencent Qplay service

The QPlay service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.QPlayService().OneOfTheMethodsBelow({...})
```

## Actions

### QPlayAuth

```js
const result = await sonos.generatedServices.QPlayService().QPlayAuth({ Seed:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Seed** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Code** | `string` |  |
| **MID** | `string` |  |
| **DID** | `string` |  |

