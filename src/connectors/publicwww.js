import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get(
      `https://publicwww.com/websites/${encodeURIComponent(query)}/`,
      {
        params: apiKeys.publicwww
          ? { key: apiKeys.publicwww, export: 'json', limit: 10 }
          : {},
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
      }
    );
    if (typeof response.data === 'object' && response.data !== null) {
      const items = Array.isArray(response.data) ? response.data : response.data.results || [];
      return items.slice(0, 10).map((item, i) =>
        normalise('publicwww', query, {
          title: item.url || item,
          url: item.url || item,
          snippet: '',
          rank: i + 1,
        })
      );
    }
    const $ = cheerio.load(response.data);
    const results = [];
    $('.results-list a').each((i, el) => {
      const url = $(el).attr('href') || $(el).text().trim();
      if (url) results.push(normalise('publicwww', query, { title: url, url, snippet: '', rank: i + 1 }));
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/publicwww]', err.message); return []; }
}

export { search };
