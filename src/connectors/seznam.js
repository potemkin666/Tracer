const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://search.seznam.cz/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.w-ul .result, .result').each((i, el) => {
      const linkEl = $(el).find('a').first();
      const title = linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('p').text().trim();
      if (title || url) results.push(normalise('seznam', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
