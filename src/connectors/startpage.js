const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://www.startpage.com/search', {
      params: { q: query, language: 'english' },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.w-gl__result').each((i, el) => {
      const titleEl = $(el).find('h3');
      const title = titleEl.text().trim();
      const url = $(el).find('.w-gl__result-title').attr('href') || $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('.w-gl__description').text().trim();
      if (title || url) results.push(normalise('startpage', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
