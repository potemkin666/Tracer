import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.openalex.org/works', {
      params: { search: query, per_page: 10 },
      timeout: 10000,
    });
    const items = response.data.results || [];
    return items.map((item, i) => {
      let url;
      if (item.doi) {
        const doi = item.doi.replace('https://doi.org/', '');
        url = `https://doi.org/${doi}`;
      } else {
        url = `https://openalex.org/${item.id}`;
      }
      return normalise('openalex', query, {
        title: item.title || '',
        url,
        snippet: '',
        rank: i + 1,
      });
    });
  } catch (err) { console.error('[connectors/openalex]', err.message); return []; }
}

export { search };
