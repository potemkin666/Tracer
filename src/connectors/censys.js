import axios from 'axios';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.post(
      'https://search.censys.io/api/v2/hosts/search',
      { q: query, per_page: 10 },
      {
        auth: { username: apiKeys.censysId, password: apiKeys.censysSecret },
        timeout: 10000,
      }
    );
    const hits = (response.data.result && response.data.result.hits) || [];
    return hits.map((hit, i) =>
      normalise('censys', query, {
        title: hit.name || hit.ip,
        url: `https://search.censys.io/hosts/${hit.ip}`,
        snippet: (hit.services || []).map((s) => `${s.port}/${s.service_name}`).join(', '),
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/censys]', err.message); return []; }
}

export { search };
