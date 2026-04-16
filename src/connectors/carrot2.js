const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://search.carrot2.org/search', {
      params: { query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result-list .result').each((i, el) => {
      const title = $(el).find('.result-title').text().trim();
      const url = $(el).find('.result-url').text().trim();
      const snippet = $(el).find('.result-snippet').text().trim();
      if (title || url) results.push(normalise('carrot2', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
