import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://stract.com/beta/api/search', {
      params: { q: query, numResults: 10 },
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });
    const items = (response.data && response.data.webpages) || [];
    return items.map((item, i) =>
      normalise('stract', query, {
        title: item.title || '',
        url: item.url || '',
        snippet: item.snippet || '',
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/stract]', err.message); return []; }
}

export { search };
