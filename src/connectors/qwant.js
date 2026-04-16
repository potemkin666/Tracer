const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.qwant.com/v3/search/web', {
      params: { q: query, count: 10, locale: 'en_US', t: 'web' },
      timeout: 10000,
    });
    const mainline =
      (response.data.data &&
        response.data.data.result &&
        response.data.data.result.items &&
        response.data.data.result.items.mainline) || [];
    const results = [];
    let rank = 1;
    for (const group of mainline) {
      if (group.type === 'web') {
        for (const item of (group.data || [])) {
          results.push(normalise('qwant', query, { title: item.title, url: item.url, snippet: item.desc, rank: rank++ }));
        }
      }
    }
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
