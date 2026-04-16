const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://www.secretsearchenginelabs.com/search.php', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('a[href^="http"]').each((i, el) => {
      const url = $(el).attr('href') || '';
      const title = $(el).text().trim();
      if (title && url && !url.includes('secretsearchenginelabs')) {
        results.push(normalise('secretsearch', query, { title, url, snippet: '', rank: i + 1 }));
      }
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/secretsearch]', err.message); return []; }
}
module.exports = { search };
