const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://www.mamma.com/', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .web-result, .organic').each((i, el) => {
      const title = $(el).find('h2 a, h3 a, .title a').first().text().trim();
      const url = $(el).find('h2 a, h3 a, .title a').first().attr('href') || '';
      const snippet = $(el).find('.description, .snippet, p').first().text().trim();
      if (title || url) results.push(normalise('mamma', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch { return []; }
}
module.exports = { search };
