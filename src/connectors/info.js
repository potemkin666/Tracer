import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://info.com/serp', {
      params: { q: query },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .search-result, .web-result').each((i, el) => {
      const titleEl = $(el).find('a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';
      const snippet = $(el).find('p, .snippet, .description').first().text().trim();
      if (title || url) results.push(normalise('info', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/info]', err.message); return []; }
}

export { search };
