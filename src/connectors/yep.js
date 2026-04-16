import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.yep.com/fc/search', {
      params: { client: 'web', gl: 'US', no_correct: 'false', q: query, safeSearch: 'moderate', type: 'web' },
      timeout: 10000,
    });
    const groups = Array.isArray(response.data) ? response.data : [];
    const results = [];
    let rank = 1;
    for (const group of groups) {
      for (const item of (group.results || [])) {
        results.push(normalise('yep', query, { title: item.title, url: item.url, snippet: item.snippet, rank: rank++ }));
      }
    }
    return results;
  } catch (err) { console.error('[connectors/yep]', err.message); return []; }
}

export { search };
