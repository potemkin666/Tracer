import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.daft.ie/search', {
      params: { q: query },
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        'Accept-Language': 'en-IE,en;q=0.9',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.property-card, .search-result, article').each((i, el) => {
      const titleEl = $(el).find('h2 a, h3 a, .address a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      const url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('.price, p, .description').first().text().trim();
      if (title || url) { results.push(normalise('daft-ie', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/daft-ie]', err.message); return []; }
}

export { search };
