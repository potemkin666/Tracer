import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.alltheinternet.com/', {
      params: { q: query },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('[class*="result"]').each((i, el) => {
      const linkEl = $(el).find('a').first();
      const title = $(el).find('h2, h3, .title').first().text().trim() || linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('p, .description').first().text().trim();
      if (title || url) results.push(normalise('alltheinternet', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/alltheinternet]', err.message); return []; }
}

export { search };
