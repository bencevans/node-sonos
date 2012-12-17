
http = require "http"
Sonos = require "../"

sonos = new Sonos.Sonos process.env.SONOS_HOST or "192.168.2.11"

server = http.createServer (req, res) ->
  sonos.currentTrack (err, track) ->
    res.writeHead 200, {
      'Content-Type': 'text/html'
    }

    rows = []

    for key, val of track
      if key is "albumArtURI"
        val = "<img src=\"#{track.albumArtURI}\">"
      rows.push "<tr><th>#{key}</th><td>#{val}</td></tr>"


    res.write """
    <table>
      #{rows.join('')}
    </table>
    """
    res.end()

server.listen process.env.PORT or 3000