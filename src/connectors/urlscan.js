const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://urlscan.io/api/v1/search/', {
      params: { q: query, size: 10 },
      timeout: 10000,
    });
    const results = response.data.results || [];
    return results.map((r, i) =>
      normalise('urlscan', query, {
        title: (r.page && r.page.title) || (r.page && r.page.domain) || '',
        url: (r.page && r.page.url) || '',
        snippet: r.verdicts ? JSON.stringify(r.verdicts).slice(0, 200) : '',
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
