import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://kagi.com/api/v0/search', {
      headers: { Authorization: `Bot ${apiKeys.kagi}` },
      params: { q: query, limit: 10 },
      timeout: 10000,
    });
    const items = (response.data && response.data.data) || [];
    return items.map((item, i) =>
      normalise('kagi', query, { title: item.title, url: item.url, snippet: item.snippet, rank: i + 1 })
    );
  } catch (err) { console.error('[connectors/kagi]', err.message); return []; }
}

export { search };
