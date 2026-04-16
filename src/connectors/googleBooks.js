import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q: query, maxResults: 10 },
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      timeout: 10000,
    });
    const items = (response.data && response.data.items) || [];
    const results = [];
    items.forEach((item, i) => {
      const info = item.volumeInfo || {};
      const title = info.title || '';
      const url = info.infoLink || '';
      const snippet = info.description || '';
      if (title || url) { results.push(normalise('google-books', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/google-books]', err.message); return []; }
}

export { search };
