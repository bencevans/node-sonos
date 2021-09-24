---
layout: default
title: SystemProperties
---
# SystemProperties service

Manage system-wide settings, mainly account stuff

The SystemProperties service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.SystemPropertiesService().OneOfTheMethodsBelow({...})
```

## Actions

### AddAccountX

```js
const result = await sonos.generatedServices.SystemPropertiesService.AddAccountX({ AccountType:..., AccountID:..., AccountPassword:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |

### AddOAuthAccountX

```js
const result = await sonos.generatedServices.SystemPropertiesService.AddOAuthAccountX({ AccountType:..., AccountToken:..., AccountKey:..., OAuthDeviceID:..., AuthorizationCode:..., RedirectURI:..., UserIdHashCode:..., AccountTier:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |
| **OAuthDeviceID** | `string` |  |
| **AuthorizationCode** | `string` |  |
| **RedirectURI** | `string` |  |
| **UserIdHashCode** | `string` |  |
| **AccountTier** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **AccountNickname** | `string` |  |

### DoPostUpdateTasks

```js
const result = await sonos.generatedServices.SystemPropertiesService.DoPostUpdateTasks();
```

This actions returns a boolean whether or not the requests succeeded.

### EditAccountMd

```js
const result = await sonos.generatedServices.SystemPropertiesService.EditAccountMd({ AccountType:..., AccountID:..., NewAccountMd:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountMd** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### EditAccountPasswordX

```js
const result = await sonos.generatedServices.SystemPropertiesService.EditAccountPasswordX({ AccountType:..., AccountID:..., NewAccountPassword:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### EnableRDM

```js
const result = await sonos.generatedServices.SystemPropertiesService.EnableRDM({ RDMValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **RDMValue** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### GetRDM

```js
const result = await sonos.generatedServices.SystemPropertiesService.GetRDM();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **RDMValue** | `boolean` |  |

### GetString

Get a saved string.

```js
const result = await sonos.generatedServices.SystemPropertiesService.GetString({ VariableName:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **StringValue** | `string` |  |

**Remarks** Strings are saved in the system with SetString, every speaker should return the same data. Will error when not existing

### GetWebCode

```js
const result = await sonos.generatedServices.SystemPropertiesService.GetWebCode({ AccountType:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **WebCode** | `string` |  |

### ProvisionCredentialedTrialAccountX

```js
const result = await sonos.generatedServices.SystemPropertiesService.ProvisionCredentialedTrialAccountX({ AccountType:..., AccountID:..., AccountPassword:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |
| **AccountPassword** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IsExpired** | `boolean` |  |
| **AccountUDN** | `string` |  |

### RefreshAccountCredentialsX

```js
const result = await sonos.generatedServices.SystemPropertiesService.RefreshAccountCredentialsX({ AccountType:..., AccountUID:..., AccountToken:..., AccountKey:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountUID** | `number` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### Remove

Remove a saved string

```js
const result = await sonos.generatedServices.SystemPropertiesService.Remove({ VariableName:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Not sure what happens if you call this with a VariableName that doesn't exists.

### RemoveAccount

```js
const result = await sonos.generatedServices.SystemPropertiesService.RemoveAccount({ AccountType:..., AccountID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountType** | `number` |  |
| **AccountID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### ReplaceAccountX

```js
const result = await sonos.generatedServices.SystemPropertiesService.ReplaceAccountX({ AccountUDN:..., NewAccountID:..., NewAccountPassword:..., AccountToken:..., AccountKey:..., OAuthDeviceID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **NewAccountID** | `string` |  |
| **NewAccountPassword** | `string` |  |
| **AccountToken** | `string` |  |
| **AccountKey** | `string` |  |
| **OAuthDeviceID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **NewAccountUDN** | `string` |  |

### ResetThirdPartyCredentials

```js
const result = await sonos.generatedServices.SystemPropertiesService.ResetThirdPartyCredentials();
```

This actions returns a boolean whether or not the requests succeeded.

### SetAccountNicknameX

```js
const result = await sonos.generatedServices.SystemPropertiesService.SetAccountNicknameX({ AccountUDN:..., AccountNickname:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AccountUDN** | `string` |  |
| **AccountNickname** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetString

Save a string in the system

```js
const result = await sonos.generatedServices.SystemPropertiesService.SetString({ VariableName:..., StringValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **VariableName** | `string` | The key for this variable, use something unique |
| **StringValue** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

**Remarks** Strings are saved in the system, retrieve values with GetString.

