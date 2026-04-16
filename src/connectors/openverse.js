const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.openverse.org/v1/images/', {
      params: { q: query, page_size: 10 },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('openverse', query, {
        title: item.title,
        url: item.url,
        snippet: `By ${item.creator} (${item.license})`,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/openverse]', err.message); return []; }
}

module.exports = { search };
