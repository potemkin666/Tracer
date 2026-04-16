import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://listen-api.listennotes.com/api/v2/search', {
      headers: { 'X-ListenAPI-Key': apiKeys.listennotes },
      params: { q: query, type: 'episode', page_size: 10 },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('listennotes', query, {
        title: item.title_original,
        url: item.listennotes_url,
        snippet: item.description_original,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/listennotes]', err.message); return []; }
}

export { search };
