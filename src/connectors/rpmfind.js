const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://www.rpmfind.net/linux/rpm2html/search.php', {
      params: { query, submit: 'Search ...' },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('table tr').each((i, el) => {
      if (i === 0) return;
      const cells = $(el).find('td');
      const a = $(cells[0]).find('a');
      const title = a.text().trim();
      const url = 'https://www.rpmfind.net' + (a.attr('href') || '');
      const snippet = $(cells[2]).text().trim();
      if (title) results.push(normalise('rpmfind', query, { title, url, snippet, rank: i }));
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/rpmfind]', err.message); return []; }
}
module.exports = { search };
