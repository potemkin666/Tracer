import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.loc.gov/search/', {
      params: { q: query, fo: 'json' },
      headers: {
        'User-Agent': UA,
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.slice(0, 10).map((item, i) => normalise('loc-gov', query, {
      title: item.title || '',
      url: item.url || item.id || '',
      snippet: (item.description || []).join(' ').slice(0, 300),
      rank: i + 1,
    }));
  } catch (err) { console.error('[connectors/loc-gov]', err.message); return []; }
}

export { search };
