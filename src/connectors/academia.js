const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://www.academia.edu/search', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('[data-testid="work-card"], .work, .gs_rt, .research-result').each((i, el) => {
      const a = $(el).find('a').first();
      const title = a.text().trim();
      const href = a.attr('href') || '';
      const url = href.startsWith('http') ? href : 'https://www.academia.edu' + href;
      const snippet = $(el).find('p, .abstract').first().text().trim().slice(0, 200);
      if (title) results.push(normalise('academia', query, { title, url, snippet, rank: i + 1 }));
    });
    return results.slice(0, 10);
  } catch { return []; }
}
module.exports = { search };
