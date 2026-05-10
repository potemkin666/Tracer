import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';
import { DEFAULT_USER_AGENT, DEFAULT_TIMEOUT, makeAbsoluteUrl, logConnectorError } from './connectorUtils.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://catalog.hathitrust.org/Search/Home', {
      params: { lookfor: query, type: 'all' },
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Accept: 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: DEFAULT_TIMEOUT,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .search-result, .record, article').each((i, el) => {
      const titleEl = $(el).find('h3 a, h2 a, .title a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      let url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      if (url) url = makeAbsoluteUrl(url, 'https://catalog.hathitrust.org');
      const snippet = $(el).find('p, .description, .details').first().text().trim();
      if (title || url) { results.push(normalise('hathitrust', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { logConnectorError('hathitrust', err); return []; }
}

export { search };
