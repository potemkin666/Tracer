const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/webkr.json', {
      headers: {
        'X-Naver-Client-Id': apiKeys.naverClientId,
        'X-Naver-Client-Secret': apiKeys.naverClientSecret,
      },
      params: { query, display: 10, start: 1 },
      timeout: 10000,
    });
    const items = response.data.items || [];
    return items.map((item, i) =>
      normalise('naver', query, {
        title: (item.title || '').replace(/<[^>]+>/g, ''),
        url: item.link,
        snippet: (item.description || '').replace(/<[^>]+>/g, ''),
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
