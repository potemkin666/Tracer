import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await axios.get('https://www.jstor.org/action/doBasicSearch', {
      params: { Query: query, pagemark: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result-item, .search-results-item').each((i, el) => {
      const titleEl = $(el).find('.title a, h2 a, h3 a').first();
      const title = titleEl.text().trim();
      const href = titleEl.attr('href') || '';
      const url = href.startsWith('http') ? href : 'https://www.jstor.org' + href;
      const snippet = $(el).find('.abstract-excerpt, .snippet, cite').first().text().trim().slice(0, 200);
      if (title || href) results.push(normalise('jstor', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/jstor]', err.message); return []; }
}
export { search };
