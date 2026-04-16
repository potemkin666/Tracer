const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: { q: query, key: apiKeys.google, cx: apiKeys.googleCx, num: 10 },
      timeout: 10000,
    });
    const items = response.data.items || [];
    return items.map((item, i) =>
      normalise('google', query, { title: item.title, url: item.link, snippet: item.snippet, rank: i + 1 })
    );
  } catch (err) { console.error('[connectors/google]', err.message); return []; }
}

module.exports = { search };
