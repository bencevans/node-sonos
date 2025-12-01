const http = require('http')
const Sonos = require('../').Sonos

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11')

const server = http.createServer(async function (req, res) {
  const track = await sonos.currentTrack()
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })

  const rows = []

  for (const key in track) {
    if (key === 'albumArtURL') {
      rows.push('<tr><th>' + key + '</th><td><img src="' + track[key] + '"/></td></tr>')
    } else {
      rows.push('<tr><th>' + key + '</th><td>' + track[key] + '</td></tr>')
    }
  }

  res.write('<table>' + rows.join('') + '</table>')
  res.end()
})
const port = process.env.PORT || 3000
server.listen(port)

console.log('Listening on http://localhost:%d/ CTRL+C to exit', port)
