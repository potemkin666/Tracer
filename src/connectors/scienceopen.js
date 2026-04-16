import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await axios.get('https://www.scienceopen.com/search', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.article-card, .result-item, .search-result').each((i, el) => {
      const title = $(el).find('h4 a, h3 a, .article-title a').first().text().trim();
      const url = $(el).find('h4 a, h3 a, .article-title a').first().attr('href') || '';
      const snippet = $(el).find('.abstract-text, .description, p').first().text().trim().slice(0, 200);
      if (title || url) results.push(normalise('scienceopen', query, { title, url: url.startsWith('http') ? url : 'https://www.scienceopen.com' + url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/scienceopen]', err.message); return []; }
}
export { search };
