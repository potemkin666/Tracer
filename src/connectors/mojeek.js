const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKey) {
  try {
    const response = await axios.get('https://www.mojeek.com/search', {
      headers: { 'X-Mojeek-API-Key': apiKey },
      params: { q: query, fmt: 'json' },
    });

    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('mojeek', query, {
        title: item.title,
        url: item.url,
        snippet: item.desc,
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
