import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.egx.com.eg/en/companySearch.aspx', {
      params: { q: query },
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        'Accept-Language': 'en,ar;q=0.9',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.search-result, .result, tr, article').each((i, el) => {
      const titleEl = $(el).find('a, h3 a, td a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      const url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('td, p, .details').first().text().trim();
      if (title || url) { results.push(normalise('egx', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/egx]', err.message); return []; }
}

export { search };
