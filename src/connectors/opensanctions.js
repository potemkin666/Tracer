const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.post(
      'https://api.opensanctions.org/entities/_search',
      null,
      {
        params: { q: query, limit: 10 },
        timeout: 10000,
      }
    );
    const results = response.data.results || [];
    return results.map((result, i) =>
      normalise('opensanctions', query, {
        title: result.caption,
        url: `https://www.opensanctions.org/entities/${result.id}/`,
        snippet: result.schema + ' | ' + ((result.properties && result.properties.country) || []).join(', '),
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
