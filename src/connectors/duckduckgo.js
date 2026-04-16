import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://html.duckduckgo.com/html/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Tracer/1.0)',
        Accept: 'text/html',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result__body').each((i, el) => {
      const titleEl = $(el).find('.result__a');
      const title = titleEl.text().trim();
      let url = titleEl.attr('href') || '';
      // Decode DDG redirect URLs: //duckduckgo.com/l/?uddg=...
      const uddgMatch = url.match(/[?&]uddg=([^&]+)/);
      if (uddgMatch) url = decodeURIComponent(uddgMatch[1]);
      const snippet = $(el).find('.result__snippet').text().trim();
      if (url) results.push(normalise('duckduckgo', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/duckduckgo]', err.message); return []; }
}

export { search };
