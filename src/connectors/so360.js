const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://www.so.com/s', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.res-list li, #main .res-item').each((i, el) => {
      const linkEl = $(el).find('h3 a');
      const title = linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('.res-desc').text().trim();
      if (title || url) results.push(normalise('so360', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/so360]', err.message); return []; }
}

module.exports = { search };
