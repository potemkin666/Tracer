import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.crossref.org/works', {
      params: { query, rows: 10 },
      timeout: 10000,
    });
    const items = (response.data.message && response.data.message.items) || [];
    return items.map((item, i) =>
      normalise('crossref', query, {
        title: (item.title || [])[0] || '',
        url: item.URL,
        snippet: item.abstract || '',
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/crossref]', err.message); return []; }
}

export { search };
