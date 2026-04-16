import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://www.researchgate.net/search', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('[class*="search-box__result"], [class*="nova-legacy-e-text--clamp"]').each((i, el) => {
      const a = $(el).find('a').first();
      const title = a.text().trim();
      const href = a.attr('href') || '';
      const url = href.startsWith('http') ? href : 'https://www.researchgate.net' + href;
      const snippet = $(el).find('[class*="description"], [class*="abstract"]').first().text().trim().slice(0, 200);
      if (title) results.push(normalise('researchgate', query, { title, url, snippet, rank: i + 1 }));
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/researchgate]', err.message); return []; }
}
export { search };
