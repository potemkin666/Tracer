import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.ecosia.org/search', {
      params: { q: query },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('[data-test-id="result"], .result').each((i, el) => {
      const titleEl = $(el).find('h2, .result-title');
      const title = titleEl.text().trim();
      const url = $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('p, .result-description').first().text().trim();
      if (title || url) results.push(normalise('ecosia', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/ecosia]', err.message); return []; }
}

export { search };
