---
layout: default
title: ContentDirectory
---
# ContentDirectory service

Browse for local content

The ContentDirectory service is available on these models: `v1-S1` / `v1-S5` / `v1-S9` / `v2-S13` / `v2-S14` / `v2-S27` / `v2-S3` / `v2-S6` / `v2-Sub`.

```js
const Sonos = require('sonos').Sonos
const sonos = new Sonos('192.168.x.x')
sonos.generatedServices.ContentDirectoryService().OneOfTheMethodsBelow({...})
```

## Actions

### Browse

Browse for content: Music library (A), share(S:), Sonos playlists(SQ:), Sonos favorites(FV:2), radio stations(R:0/0), radio shows(R:0/1). Recommendation: Send one request, check the &#x60;TotalMatches&#x60; and - if necessary - do additional requests with higher &#x60;StartingIndex&#x60;. In case of duplicates only the first is returned! Example: albums with same title, even if artists are different

```js
const result = await sonos.generatedServices.ContentDirectoryService.Browse({ ObjectID:..., BrowseFlag:..., Filter:..., StartingIndex:..., RequestedCount:..., SortCriteria:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` | The search query, (`A:ARTIST` / `A:ALBUMARTIST` / `A:ALBUM` / `A:GENRE` / `A:COMPOSER` / `A:TRACKS` / `A:PLAYLISTS` / `S:` / `SQ:` / `FV:2` / `R:0/0` / `R:0/1`) with optionally `:search+query` behind it. |
| **BrowseFlag** | `string` | How to browse Allowed values: `BrowseMetadata` / `BrowseDirectChildren` |
| **Filter** | `string` | Which fields should be returned `*` for all. |
| **StartingIndex** | `number` | Paging, where to start, usually 0 |
| **RequestedCount** | `number` | Paging, number of items, maximum is 1,000. This parameter does NOT restrict the number of items being searched (filter) but only the number being returned.  |
| **SortCriteria** | `string` | Sort the results based on metadata fields. `+upnp:artist,+dc:title` for sorting on artist then on title. |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Result** | `string` | Encoded DIDL-Lite XML. See remark (2) |
| **NumberReturned** | `number` |  |
| **TotalMatches** | `number` |  |
| **UpdateID** | `number` |  |

**Remarks** (1) If the title contains an apostrophe the returned uri will contain a `&apos;`. (2) Some libraries support a BrowseAndParse, so you don't have to parse the xml.

### CreateObject

```js
const result = await sonos.generatedServices.ContentDirectoryService.CreateObject({ ContainerID:..., Elements:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ContainerID** | `string` |  |
| **Elements** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Result** | `string` |  |

### DestroyObject

```js
const result = await sonos.generatedServices.ContentDirectoryService.DestroyObject({ ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### FindPrefix

```js
const result = await sonos.generatedServices.ContentDirectoryService.FindPrefix({ ObjectID:..., Prefix:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **Prefix** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **StartingIndex** | `number` |  |
| **UpdateID** | `number` |  |

### GetAlbumArtistDisplayOption

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetAlbumArtistDisplayOption();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

### GetAllPrefixLocations

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetAllPrefixLocations({ ObjectID:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **TotalPrefixes** | `number` |  |
| **PrefixAndIndexCSV** | `string` |  |
| **UpdateID** | `number` |  |

### GetBrowseable

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetBrowseable();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IsBrowseable** | `boolean` |  |

### GetLastIndexChange

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetLastIndexChange();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **LastIndexChange** | `string` |  |

### GetSearchCapabilities

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetSearchCapabilities();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SearchCaps** | `string` |  |

### GetShareIndexInProgress

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetShareIndexInProgress();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **IsIndexing** | `boolean` |  |

### GetSortCapabilities

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetSortCapabilities();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **SortCaps** | `string` |  |

### GetSystemUpdateID

```js
const result = await sonos.generatedServices.ContentDirectoryService.GetSystemUpdateID();
```

Output object:

| property | type | description |
|:----------|:-----|:------------|
| **Id** | `number` |  |

### RefreshShareIndex

```js
const result = await sonos.generatedServices.ContentDirectoryService.RefreshShareIndex({ AlbumArtistDisplayOption:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **AlbumArtistDisplayOption** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### RequestResort

```js
const result = await sonos.generatedServices.ContentDirectoryService.RequestResort({ SortOrder:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **SortOrder** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

### SetBrowseable

```js
const result = await sonos.generatedServices.ContentDirectoryService.SetBrowseable({ Browseable:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **Browseable** | `boolean` |  |

This actions returns a boolean whether or not the requests succeeded.

### UpdateObject

```js
const result = await sonos.generatedServices.ContentDirectoryService.UpdateObject({ ObjectID:..., CurrentTagValue:..., NewTagValue:... });
```

Input object:

| property | type | description |
|:----------|:-----|:------------|
| **ObjectID** | `string` |  |
| **CurrentTagValue** | `string` |  |
| **NewTagValue** | `string` |  |

This actions returns a boolean whether or not the requests succeeded.

