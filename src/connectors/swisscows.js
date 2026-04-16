const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.swisscows.com/web/search', {
      headers: { 'x-api-key': apiKeys.swisscows },
      params: { query, numberOfItems: 10, itemsOffset: 0 },
      timeout: 10000,
    });
    const items = response.data.items || [];
    return items.map((item, i) =>
      normalise('swisscows', query, { title: item.title, url: item.url, snippet: item.description, rank: i + 1 })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
