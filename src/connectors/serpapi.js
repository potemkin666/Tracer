const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const apiKey = apiKeys.serpapi;
    const response = await axios.get('https://serpapi.com/search', {
      params: { q: query, api_key: apiKey, num: 10 },
    });

    const items = response.data.organic_results || [];
    return items.map((item, i) =>
      normalise('serpapi', query, {
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/serpapi]', err.message); return []; }
}

module.exports = { search };
