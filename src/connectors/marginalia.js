import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get(
      `https://api.marginalia.nu/search/${encodeURIComponent(query)}`,
      { params: { count: 10 }, timeout: 10000 }
    );
    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('marginalia', query, { title: item.title, url: item.url, snippet: item.description, rank: i + 1 })
    );
  } catch (err) { console.error('[connectors/marginalia]', err.message); return []; }
}

export { search };
