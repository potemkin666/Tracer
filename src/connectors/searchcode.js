const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://searchcode.com/api/codesearch_I/', {
      params: { q: query, p: 0, per_page: 10 },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.map((result, i) =>
      normalise('searchcode', query, {
        title: `${result.name} / ${result.filename}`,
        url: `https://searchcode.com${result.location}`,
        snippet: Object.values(result.lines || {}).join(' ').slice(0, 200),
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
