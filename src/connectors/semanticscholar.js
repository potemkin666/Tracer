const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get(
      'https://api.semanticscholar.org/graph/v1/paper/search',
      {
        params: { query, limit: 10, fields: 'title,url,abstract,authors,year' },
        timeout: 10000,
      }
    );
    const items = response.data.data || [];
    return items.map((item, i) =>
      normalise('semantic-scholar', query, {
        title: item.title,
        url: item.url || `https://api.semanticscholar.org/graph/v1/paper/${item.paperId}`,
        snippet: item.abstract || '',
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/semanticscholar]', err.message); return []; }
}

module.exports = { search };
