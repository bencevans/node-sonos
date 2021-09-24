# node-sonos template

This folder contains the template files for [node-sonos](://github.com/bencevans/node-sonos), and is not used in the actual library just yet.

## Folder content

| File | Description | Remarks |
|:-----|:------------|:--------|
| [service](./service.hbs) | Single service | Strong type service template |

## Use this template

To use this template you'll need both this generator and node-sonos checked out.

```shell
# from root of repository

# generate the intermediate file (this will take the online documentation file)
npx @svrooij/sonos-docs combine

# Make sure you don't have any changes in node-sonos, that makes it unclear what the generator changed
# generate the service files (set the correct root folder for node-sonos)
npx @svrooij/sonos-docs generate ./.generator/node/ ./
```

## Generator

See the generator documentation [here](https://github.com/svrooij/sonos-api-docs/tree/main/generator/sonos-docs).
