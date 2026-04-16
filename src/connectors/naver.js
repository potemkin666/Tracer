const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

function stripTags(html) {
  return cheerio.load(html).text();
}

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
        title: stripTags(item.title || ''),
        url: item.link,
        snippet: stripTags(item.description || ''),
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/naver]', err.message); return []; }
}

module.exports = { search };
