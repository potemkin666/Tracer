import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const apiKey = apiKeys.mojeek;
    const response = await axios.get('https://www.mojeek.com/search', {
      headers: { 'X-Mojeek-API-Key': apiKey },
      params: { q: query, fmt: 'json' },
    });

    const items = response.data.results || [];
    return items.map((item, i) =>
      normalise('mojeek', query, {
        title: item.title,
        url: item.url,
        snippet: item.desc,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/mojeek]', err.message); return []; }
}

export { search };
