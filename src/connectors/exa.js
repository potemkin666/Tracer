const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    if (!apiKeys.exa) return [];
    const response = await axios.post(
      'https://api.exa.ai/search',
      { query, numResults: 10, useAutoprompt: true },
      {
        headers: { 'x-api-key': apiKeys.exa, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    const items = (response.data && response.data.results) || [];
    return items.map((item, i) =>
      normalise('exa', query, {
        title: item.title || '',
        url: item.url || item.id || '',
        snippet: item.author || item.publishedDate || '',
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
