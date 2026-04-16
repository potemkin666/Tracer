const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://ahmia.fi/search/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result').each((i, el) => {
      const linkEl = $(el).find('h4 a');
      const title = linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('cite').text().trim();
      if (title || url) results.push(normalise('ahmia', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
