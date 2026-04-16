import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.givewater.com/search', {
      params: { q: query },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.search-result, .result, article').each((i, el) => {
      const titleEl = $(el).find('h3 a, h2 a, .title a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      let url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      if (url && !url.startsWith('http')) url = 'https://www.givewater.com' + url;
      const snippet = $(el).find('p, .description, .snippet').first().text().trim();
      if (title || url) results.push(normalise('givewater', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/givewater]', err.message); return []; }
}

export { search };
