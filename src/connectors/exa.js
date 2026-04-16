import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    if (!apiKeys.exa) return [];
    const response = await httpClient.post(
      'https://api.exa.ai/search',
      { query, numResults: 10, useAutoprompt: true },
      {
        headers: { 'x-api-key': apiKeys.exa, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    const items = (response.data && response.data.results) || [];
    return items.map((item, i) =>
      normalise('exa', query, {
        title: item.title || '',
        url: item.url || item.id || '',
        snippet: item.author || item.publishedDate || '',
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/exa]', err.message); return []; }
}

export { search };
