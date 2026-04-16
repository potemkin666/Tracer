const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://worldwidescience.org/wws/search/results.do', {
      params: { func: 'search', query, databaseList: '' },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result-item, .searchResult').each((i, el) => {
      const title = $(el).find('.title a, h3 a, h2 a').first().text().trim();
      const url = $(el).find('.title a, h3 a, h2 a').first().attr('href') || '';
      const snippet = $(el).find('.abstract, .description, p').first().text().trim().slice(0, 200);
      if (title || url) results.push(normalise('worldwidescience', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch { return []; }
}
module.exports = { search };
