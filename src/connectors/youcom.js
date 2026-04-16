const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://you.com/search', {
      params: { q: query },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.yqd_x, .result').each((i, el) => {
      const titleEl = $(el).find('a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';
      const snippet = $(el).find('p, .snippet').first().text().trim();
      if (title || url) results.push(normalise('you.com', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/youcom]', err.message); return []; }
}

module.exports = { search };
