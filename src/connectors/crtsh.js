const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://crt.sh/', {
      params: { q: query, output: 'json' },
      timeout: 10000,
    });
    const items = Array.isArray(response.data) ? response.data : [];
    const seen = new Set();
    const results = [];
    for (const item of items) {
      const cn = item.common_name;
      if (seen.has(cn)) continue;
      seen.add(cn);
      results.push(
        normalise('crt.sh', query, {
          title: `[cert] ${cn}`,
          url: `https://crt.sh/?q=${encodeURIComponent(cn)}`,
          snippet: `Issuer: ${item.issuer_name} | Valid until: ${item.not_after}`,
          rank: results.length + 1,
        })
      );
      if (results.length >= 10) break;
    }
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
