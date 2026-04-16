import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.kiddle.co/s.php', {
      params: { q: query },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .regular-search-result').each((i, el) => {
      const titleEl = $(el).find('h3 a, h2 a, a.title').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      let url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      if (url && !url.startsWith('http')) { url = 'https://www.kiddle.co' + url; }
      const snippet = $(el).find('p, .snippet, .description').first().text().trim();
      if (title || url) { results.push(normalise('kiddle', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/kiddle]', err.message); return []; }
}

export { search };
