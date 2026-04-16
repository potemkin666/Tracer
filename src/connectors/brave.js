const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKey) {
  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
      params: { q: query, count: 10 },
    });

    const items = (response.data.web && response.data.web.results) || [];
    return items.map((item, i) =>
      normalise('brave', query, {
        title: item.title,
        url: item.url,
        snippet: item.description,
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
