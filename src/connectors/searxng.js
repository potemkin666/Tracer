const axios = require('axios');
const { normalise } = require('../normaliser');

const DEFAULT_INSTANCES = [
  'https://searx.be',
  'https://searxng.world',
  'https://search.disroot.org',
];

async function search(query, apiKeys = {}) {
  const instances = apiKeys.searxngUrl ? [apiKeys.searxngUrl] : DEFAULT_INSTANCES;
  for (const instance of instances) {
    try {
      const response = await axios.get(`${instance}/search`, {
        params: { q: query, format: 'json', language: 'en' },
        headers: { 'User-Agent': 'Tracer/1.0', Accept: 'application/json' },
        timeout: 10000,
      });
      const items = response.data.results || [];
      if (items.length === 0) continue;
      return items.map((item, i) =>
        normalise('searxng', query, { title: item.title, url: item.url, snippet: item.content, rank: i + 1 })
      );
    } catch (err) {
      console.error('[connectors/searxng]', err.message);
    }
  }
  return [];
}

module.exports = { search };
