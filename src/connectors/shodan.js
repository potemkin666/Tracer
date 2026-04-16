const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.shodan.io/shodan/host/search', {
      params: { key: apiKeys.shodan, query, page: 1 },
      timeout: 10000,
    });
    const matches = response.data.matches || [];
    return matches.map((match, i) =>
      normalise('shodan', query, {
        title: `${match.ip_str} (${(match.hostnames || []).join(',') || match.org || ''})`,
        url: `https://www.shodan.io/host/${match.ip_str}`,
        snippet: (match.data || '').slice(0, 200),
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
