import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://yacy.searchlab.eu/yacysearch.json', {
      params: { query, maximumRecords: 10, resource: 'global', verify: 'true' },
      headers: { 'User-Agent': 'Tracer/1.0', Accept: 'application/json' },
      timeout: 10000,
    });
    const channels = response.data.channels || [];
    const items = channels.flatMap(ch => ch.items || []);
    return items.slice(0, 10).map((item, i) =>
      normalise('yacy', query, { title: item.title || '', url: item.link || '', snippet: item.description || '', rank: i + 1 })
    );
  } catch (err) { console.error('[connectors/yacy]', err.message); return []; }
}
export { search };
