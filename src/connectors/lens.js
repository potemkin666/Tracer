const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKeys.lens) headers['Authorization'] = `Bearer ${apiKeys.lens}`;
    const response = await axios.post(
      'https://api.lens.org/scholarly/search',
      { query: { multi_match: { query, fields: ['title', 'author'] } }, size: 10 },
      { headers, timeout: 10000 }
    );
    const items = (response.data && response.data.data) || [];
    return items.map((item, i) =>
      normalise('lens', query, {
        title: item.title || '',
        url: `https://lens.org/lens/scholar/article/${item.lens_id}`,
        snippet: item.abstract || '',
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
