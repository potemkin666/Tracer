const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://metager.org/meta/meta.ger3', {
      params: { eingabe: query, key: apiKeys.metager, out: 'json' },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('metager', query, { title: item.title, url: item.link, snippet: item.description, rank: i + 1 })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
