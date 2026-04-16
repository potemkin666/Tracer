const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://wiby.me/', {
      params: { q: query, format: 'json' },
      timeout: 10000,
    });
    const data = response.data;
    const items = Array.isArray(data) ? data : (data.results || []);
    return items.map((item, i) =>
      normalise('wiby', query, {
        title: item.title || item.Title || '',
        url: item.url || item.URL || '',
        snippet: item.snippet || item.Snippet || '',
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
