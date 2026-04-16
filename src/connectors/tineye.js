const axios = require('axios');
const { normalise } = require('../normaliser');

// TineEye is reverse image search — only useful when query is an image URL
function isImageUrl(s) {
  return /^https?:\/\/.+\.(jpe?g|png|gif|webp|bmp|tiff?)(\?.*)?$/i.test(s);
}

async function search(query, apiKeys = {}) {
  const apiKey = apiKeys.tineye;
  if (!apiKey || !isImageUrl(query)) return [];
  try {
    const response = await axios.get('https://api.tineye.com/rest/search/', {
      params: { api_key: apiKey, image_url: query, limit: 10, offset: 0 },
      timeout: 15000,
    });
    const matches = (response.data && response.data.results && response.data.results.matches) || [];
    return matches.map((m, i) =>
      normalise('tineye', query, {
        title: m.domain || m.backlink || '',
        url: m.backlink || `https://${m.domain}`,
        snippet: `Match found on ${m.domain} (image size: ${m.image_url ? 'known' : 'unknown'})`,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/tineye]', err.message); return []; }
}
module.exports = { search };
