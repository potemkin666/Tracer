import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';
import { DEFAULT_USER_AGENT, DEFAULT_TIMEOUT, logConnectorError } from './connectorUtils.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://www.egyptianindustry.com/search', {
      params: { q: query },
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Accept: 'text/html',
        'Accept-Language': 'en,ar;q=0.9',
      },
      timeout: DEFAULT_TIMEOUT,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.listing, .search-result, article').each((i, el) => {
      const titleEl = $(el).find('h2 a, h3 a, .name a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      const url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('.address, p, .details').first().text().trim();
      if (title || url) { results.push(normalise('egyptian-industry', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { logConnectorError('egyptian-industry', err); return []; }
}

export { search };
