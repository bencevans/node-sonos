const axios = require('axios');
const jsdom = require('jsdom');
const Helpers = require('../helpers');


/**
 * Get a soundcloud client_id
 * Stolen from https://github.com/3jackdaws/soundcloud-lib
 */
class SoundCloudClientId {
  constructor() {
    this.clientId = null
  }

  /**
   * Get the id
   * @returns {string} The client_id
   */
  async get() {
    if (this.clientId) return this.clientId;

    const dom = await jsdom.JSDOM.fromURL('https://soundcloud.com/mt-marcy/cold-nights')
    const scripts = dom.window.document.querySelectorAll('script');

    for (const script of scripts) {
      const src = script.getAttribute('src')
      if (src) {
        const script_src = await axios({ url: src, method: 'GET' })
        if (script_src.status === 200) {
          const clientIds = script_src.data.match(/client_id=([a-zA-Z0-9]+)/)
          if (clientIds && clientIds.length > 1) { 
            this.clientId = clientIds[1];
            break;
          }
        }
      }
    }
    return this.clientId;
  }
}

const soundCloudClientId = new SoundCloudClientId();


/**
 * Enhance metadata with data from original sources
 *   * Add radio title and album art
 *   * Add soundcloud album art
 */
module.exports = async function enhanceMetadata(track, metadata, mediaInfo) {
  // Radio
  if (mediaInfo && mediaInfo.CurrentURI && mediaInfo.CurrentURI.startsWith('x-sonosapi-stream')) {
    track.albumArtURI = `/getaa?s=1&u=${encodeURIComponent(mediaInfo.CurrentURI)}`;
    if (mediaInfo.CurrentURIMetaData) {
      const miMetadata = await Helpers.ParseXml(mediaInfo.CurrentURIMetaData);
      const parsedMediainfo = Helpers.ParseDIDL(miMetadata);

      // For radio set artist = stream title
      if (!track.artist) track.artist = parsedMediainfo.title
    }
  }

  // Soundcloud
  const uriParts = /x-sonos-http:track%3a(\d+)\.mp3\?sid=160/.exec(track.uri);
  if (uriParts) {
    const id = uriParts[1];
    const clientId = process.env.SOUNDCLOUD_CLIENT_ID || await soundCloudClientId.get();
    const apiUrl = `http://api-v2.soundcloud.com/tracks/${id}?client_id=${clientId}`;
    const res = await axios({ url: apiUrl, method: 'GET' });
    if (res.status === 200 && res.data && res.data.artwork_url) {
      track.albumArtURI = res.data.artwork_url.replace('large', 't500x500');
    }
  }
}
