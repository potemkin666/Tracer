import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://api.bing.microsoft.com/v7.0/search', {
      headers: { 'Ocp-Apim-Subscription-Key': apiKeys.bing },
      params: { q: query, count: 10, mkt: 'en-US' },
      timeout: 10000,
    });
    const items = (response.data.webPages && response.data.webPages.value) || [];
    return items.map((item, i) =>
      normalise('bing', query, { title: item.name, url: item.url, snippet: item.snippet, rank: i + 1 })
    );
  } catch (err) { console.error('[connectors/bing]', err.message); return []; }
}

export { search };
