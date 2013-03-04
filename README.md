# node-sonos

Node.js Interface to [Sonos](http://sonos.com)

Please open [pull-requests](https://github.com/bencevans/node-sonos) and ask questions [@bencevans](https://twitter.com/bencevans).

## API

For detailed info read the [/API.md](https://github.com/bencevans/node-sonos/blob/master/README.md) file, else…

* search([deviceAvailableListener])
* Class: Search()
  * Event: 'DeviceAvailable'
* Class: Sonos(host, [port])
  * currentTrack(callback)
  * play([url], [callback])
  * pause([callback])
  * stop([callback])
  * next([callback])
  * previous([callback])
  * queueNext(url, [callback])

## Examples

Additional examples can be found in the [/examples](https://github.com/bencevans/node-sonos/tree/master/examples) directory within the repository.

## Installation

*Via npm*

    npm install sonos

*Via Git*

    npm install git://github.com/bencevans/node-sonos.git

## Licence

(MIT Licence)

    Copyright (c) 2012 Ben Evans

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.