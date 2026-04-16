const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://millionshort.com/search', {
      params: { keywords: query, remove: '1000000' },
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        Cookie: 'remove=1000000',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result').each((i, el) => {
      const titleEl = $(el).find('.result-title a');
      const title = titleEl.text().trim();
      const url = $(el).find('.result-url').text().trim() || titleEl.attr('href') || '';
      const snippet = $(el).find('.result-description').text().trim();
      if (title || url) results.push(normalise('millionshort', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
